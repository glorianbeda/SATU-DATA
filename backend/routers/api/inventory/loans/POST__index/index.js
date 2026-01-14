const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

module.exports = [
  authMiddleware,
  async (req, res) => {
    const { assetId, dueDate, notes } = req.body;

    if (!assetId) {
      return res.status(400).json({ error: "Asset ID is required" });
    }

    try {
      // Check if asset exists and is available
      const asset = await prisma.asset.findUnique({
        where: { id: parseInt(assetId) },
        include: {
          loans: {
            where: {
              status: { in: ["PENDING", "APPROVED", "BORROWED"] },
            },
          },
        },
      });

      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }

      if (asset.status !== "AVAILABLE") {
        return res.status(400).json({
          error: `Asset is not available. Current status: ${asset.status}`,
        });
      }

      if (asset.loans.length > 0) {
        return res.status(400).json({
          error: "Asset already has active loan requests",
        });
      }

      // Calculate due date (default 7 days from now)
      const defaultDueDate = new Date();
      defaultDueDate.setDate(defaultDueDate.getDate() + 7);

      const loan = await prisma.loan.create({
        data: {
          assetId: parseInt(assetId),
          borrowerId: req.user.id,
          dueDate: dueDate ? new Date(dueDate) : defaultDueDate,
          notes: notes || null,
        },
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
        },
      });

      // Create asset log
      await prisma.assetLog.create({
        data: {
          assetId: parseInt(assetId),
          loanId: loan.id,
          action: "BORROWED",
          userId: req.user.id,
          notes: "Loan requested",
        },
      });

      res.status(201).json({ loan });
    } catch (error) {
      console.error("Create loan error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
];
