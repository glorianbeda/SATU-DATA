const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    const auditLogs = await prisma.balanceAuditLog.findMany({
      include: {
        changedBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { changedAt: "desc" },
      take: 50,
    });

    res.json({ history: auditLogs });
  } catch (error) {
    console.error("Get balance history error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
