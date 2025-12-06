const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Verification token is required" });
  }

  try {
    // Find user by verification token
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification token" });
    }

    if (user.status === "VERIFIED") {
      return res.status(400).json({ error: "Email already verified" });
    }

    if (user.status !== "APPROVED") {
      return res.status(400).json({ error: "Account is not approved" });
    }

    // Update user status to VERIFIED and clear token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        status: "VERIFIED",
        verificationToken: null,
      },
    });

    res.json({
      message: "Email verified successfully. You can now login.",
    });
  } catch (error) {
    console.error("Verify email error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
