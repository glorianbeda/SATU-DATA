const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

module.exports = [
  authMiddleware,
  async (req, res) => {
    try {
      const [totalAssets, available, borrowed, maintenance, lost] =
        await Promise.all([
          prisma.asset.count(),
          prisma.asset.count({ where: { status: "AVAILABLE" } }),
          prisma.asset.count({ where: { status: "BORROWED" } }),
          prisma.asset.count({ where: { status: "MAINTENANCE" } }),
          prisma.asset.count({ where: { status: "LOST" } }),
        ]);

      const [pendingRequests, overdue] = await Promise.all([
        prisma.loan.count({
          where: {
            status: "PENDING",
          },
        }),
        prisma.loan.count({
          where: {
            status: { in: ["BORROWED", "OVERDUE"] },
            dueDate: { lt: new Date() },
          },
        }),
      ]);

      res.json({
        totalAssets,
        available,
        borrowed,
        maintenance,
        lost,
        pendingRequests,
        overdue,
      });
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
];
