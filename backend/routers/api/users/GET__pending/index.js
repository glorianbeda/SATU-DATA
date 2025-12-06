const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    // Check if user is admin (match actual role names from database)
    const adminRoles = ["Super Admin", "Admin"];
    if (!adminRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const pendingUsers = await prisma.user.findMany({
      where: { status: "PENDING" },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ users: pendingUsers });
  } catch (error) {
    console.error("Get pending users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
