const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");
const authMiddleware = require("@/middleware/auth");
const { sendVerificationEmail } = require("@/services/emailService");

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    // Check if user is admin
    const adminRoles = ["SUPER_ADMIN", "ADMIN"];
    if (!adminRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Spam protection - check user status
    if (user.status === "VERIFIED") {
      return res.status(400).json({ error: "User is already verified" });
    }

    if (user.status === "APPROVED") {
      return res.status(400).json({
        error: "User is already approved. Verification email was already sent.",
      });
    }

    if (user.status === "REJECTED") {
      return res.status(400).json({ error: "Cannot approve a rejected user" });
    }

    if (user.status !== "PENDING") {
      return res.status(400).json({ error: "User is not in pending status" });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Update user status to APPROVED and set token
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        status: "APPROVED",
        verificationToken,
      },
    });

    // Send verification email using global service (with rate limiting)
    const emailResult = await sendVerificationEmail(
      user.email,
      user.name,
      verificationToken
    );

    if (!emailResult.success) {
      // If email failed due to rate limit, still mark as approved
      if (emailResult.rateLimited) {
        return res.status(429).json({
          error: emailResult.error,
          retryAfter: emailResult.retryAfter,
          user: {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            status: updatedUser.status,
          },
        });
      }
      // Other email errors
      console.error("Email send failed:", emailResult.error);
    }

    res.json({
      message: "User approved and verification email sent",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        status: updatedUser.status,
      },
    });
  } catch (error) {
    console.error("Approve user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
