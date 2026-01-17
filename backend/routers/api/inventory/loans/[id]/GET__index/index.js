const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");
const checkRole = require("@/middleware/checkRole");

const prisma = new PrismaClient();

module.exports = [
  authMiddleware,
  checkRole([
    "SUPER_ADMIN",
    "ADMIN",
    "KOORDINATOR_INVENTARIS",
    "USER",
    "STAFF",
  ]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const loan = await prisma.loan.findUnique({
        where: { id: parseInt(id) },
        include: {
          asset: true,
          borrower: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          approvedBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!loan) {
        return res.status(404).json({ error: "Loan not found" });
      }

      // Check permission: User can only view their own loan, Admin can view all
      const user = req.user;
      const isAdmin = [
        "SUPER_ADMIN",
        "ADMIN",
        "KOORDINATOR_INVENTARIS",
      ].includes(user.role.name);

      if (!isAdmin && loan.borrowerId !== user.id) {
        return res
          .status(403)
          .json({ error: "Unauthorized access to loan details" });
      }

      res.json({ loan });
    } catch (error) {
      console.error("Get loan error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
];
