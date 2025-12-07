const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

const checkRole = require("@/middleware/checkRole");

const handler = async (req, res) => {
  try {
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

module.exports = [authMiddleware, checkRole(["SUPER_ADMIN"]), handler];
