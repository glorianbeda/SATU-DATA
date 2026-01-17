const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");
const checkRole = require("@/middleware/checkRole");

const prisma = new PrismaClient();

module.exports = [
  authMiddleware,
  checkRole(["SUPER_ADMIN", "ADMIN", "KOORDINATOR_INVENTARIS"]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const loan = await prisma.loan.findUnique({
        where: { id: parseInt(id) },
        include: {
          asset: true,
        },
      });

      if (!loan) {
        return res.status(404).json({ error: "Loan not found" });
      }

      if (loan.status !== "APPROVED") {
        return res.status(400).json({
          error: `Loan cannot be marked as borrowed. Current status: ${loan.status}`,
        });
      }

      // Update asset status to BORROWED
      await prisma.$transaction([
        prisma.loan.update({
          where: { id: parseInt(id) },
          data: {
            status: "BORROWED",
            borrowedDate: new Date(),
          },
        }),
        prisma.asset.update({
          where: { id: loan.assetId },
          data: {
            status: "BORROWED",
          },
        }),
      ]);

      // Create asset log
      await prisma.assetLog.create({
        data: {
          assetId: loan.assetId,
          loanId: loan.id,
          action: "BORROWED",
          userId: req.user.id,
          notes: "Asset borrowed",
        },
      });

      const updatedLoan = await prisma.loan.findUnique({
        where: { id: parseInt(id) },
        include: {
          asset: true,
          borrower: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      res.json({ loan: updatedLoan });
    } catch (error) {
      console.error("Borrow loan error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
];
