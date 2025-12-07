const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

const checkRole = require("@/middleware/checkRole");

const handler = async (req, res) => {
  try {
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

    // Update user status to REJECTED
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        status: "REJECTED",
      },
    });

    res.json({
      message: "User rejected",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        status: updatedUser.status,
      },
    });
  } catch (error) {
    console.error("Reject user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, checkRole(["SUPER_ADMIN"]), handler];
