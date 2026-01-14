const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");
const checkRole = require("@/middleware/checkRole");

const prisma = new PrismaClient();

module.exports = [
  authMiddleware,
  async (req, res) => {
    try {
      const { status, assetId, borrowerId } = req.query;
      const userRole = req.user.role.name;

      const where = {};

      // Filter based on user role
      if (userRole === "MEMBER") {
        // Members can only see their own loans
        where.borrowerId = req.user.id;
      }

      if (status) {
        where.status = status;
      }

      if (assetId) {
        where.assetId = parseInt(assetId);
      }

      if (borrowerId && (userRole === "SUPER_ADMIN" || userRole === "ADMIN")) {
        where.borrowerId = parseInt(borrowerId);
      }

      const loans = await prisma.loan.findMany({
        where,
        include: {
          asset: {
            include: {
              category: true,
            },
          },
          borrower: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          approvedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      res.json({ loans });
    } catch (error) {
      console.error("Get loans error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
];
