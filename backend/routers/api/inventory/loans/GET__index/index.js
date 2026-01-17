const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");
const checkRole = require("@/middleware/checkRole");

const prisma = new PrismaClient();

module.exports = [
  authMiddleware,
  async (req, res) => {
    try {
      const { status, assetId, borrowerId, myLoans } = req.query;
      const userRole = req.user?.role?.name;

      const where = {};

      // If myLoans=true, filter to current user's loans only
      if (myLoans === "true") {
        where.borrowerId = req.user.id;
      } else if (!userRole || userRole === "MEMBER") {
        // Members (or users without defined role) can only see their own loans
        where.borrowerId = req.user.id;
      }

      if (status) {
        where.status = status;
      }

      if (assetId) {
        where.assetId = parseInt(assetId);
      }

      if (
        borrowerId &&
        (userRole === "SUPER_ADMIN" ||
          userRole === "ADMIN" ||
          userRole === "KOORDINATOR_INVENTARIS")
      ) {
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
