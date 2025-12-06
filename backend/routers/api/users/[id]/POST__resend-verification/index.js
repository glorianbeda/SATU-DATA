const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");
const authMiddleware = require("@/middleware/auth");
const { sendVerificationEmail } = require("@/services/emailService");

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    // Check if user is admin
    const adminRoles = ["Super Admin", "Admin"];
    if (!adminRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const userId = parseInt(req.params.id);

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Only allow resend for APPROVED users (not verified yet)
    if (user.status !== "APPROVED") {
      if (user.status === "VERIFIED") {
        return res.status(400).json({ error: "User is already verified" });
      }
      if (user.status === "PENDING") {
        return res
          .status(400)
          .json({ error: "User needs to be approved first" });
      }
      return res
        .status(400)
        .json({ error: "Cannot resend verification for this user" });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Update token
    await prisma.user.update({
      where: { id: userId },
      data: { verificationToken },
    });

    // Send verification email (with rate limiting)
    const emailResult = await sendVerificationEmail(
      user.email,
      user.name,
      verificationToken
    );

    if (!emailResult.success) {
      if (emailResult.rateLimited) {
        return res.status(429).json({
          error: emailResult.error,
          retryAfter: emailResult.retryAfter,
        });
      }
      return res
        .status(500)
        .json({ error: emailResult.error || "Failed to send email" });
    }

    res.json({
      message: "Verification email resent successfully",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
