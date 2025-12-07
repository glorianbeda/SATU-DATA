const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

const checkRole = require("@/middleware/checkRole");

const handler = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prevent deleting own account
    if (user.id === req.user.id) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }

    // Soft delete - change status to DELETED
    await prisma.user.update({
      where: { id: userId },
      data: { status: "DELETED" },
    });

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, checkRole(["SUPER_ADMIN"]), handler];
