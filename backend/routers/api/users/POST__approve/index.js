const { PrismaClient } = require("@prisma/client");
const { Resend } = require("resend");
const crypto = require("crypto");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

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

    if (user.status !== "PENDING") {
      return res.status(400).json({ error: "User is not pending" });
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

    // Send verification email
    const verificationUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5174"
    }/verify-email?token=${verificationToken}`;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: user.email,
      subject: "Verify your email - Satu Data+",
      html: `
        <h1>Welcome to Satu Data+!</h1>
        <p>Hi ${user.name},</p>
        <p>Your account has been approved. Please verify your email by clicking the link below:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px;">Verify Email</a>
        <p>Or copy and paste this link:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
      `,
    });

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
