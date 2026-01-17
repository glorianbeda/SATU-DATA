const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");
const checkRole = require("@/middleware/checkRole");
const { sendLoanNotificationEmail } = require("@/services/emailService");

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
          borrower: true,
        },
      });

      if (!loan) {
        return res.status(404).json({ error: "Loan not found" });
      }

      if (loan.status !== "PENDING") {
        return res.status(400).json({
          error: `Loan cannot be approved. Current status: ${loan.status}`,
        });
      }

      // Check if asset is still available
      if (loan.asset.status !== "AVAILABLE") {
        return res.status(400).json({
          error: `Asset is not available. Current status: ${loan.asset.status}`,
        });
      }

      const updatedLoan = await prisma.loan.update({
        where: { id: parseInt(id) },
        data: {
          status: "APPROVED",
          approvedDate: new Date(),
          approvedById: req.user.id,
        },
        include: {
          asset: true,
          borrower: true,
        },
      });

      // Create asset log
      await prisma.assetLog.create({
        data: {
          assetId: loan.assetId,
          loanId: loan.id,
          action: "STATUS_CHANGE",
          userId: req.user.id,
          notes: "Loan approved",
        },
      });

      // Send email notification to borrower
      if (loan.borrower && loan.borrower.email) {
        await sendLoanNotificationEmail(
          loan.borrower.email,
          loan.borrower.name,
          loan.asset.name,
          "APPROVED"
        );
      }

      res.json({ loan: updatedLoan });
    } catch (error) {
      console.error("Approve loan error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
];
