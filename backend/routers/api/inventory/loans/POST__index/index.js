const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

module.exports = [
  authMiddleware,
  async (req, res) => {
    const { assetId, assetIds, dueDate, notes } = req.body;

    // Normalize input to array
    let targetAssetIds = [];
    if (assetIds && Array.isArray(assetIds)) {
      targetAssetIds = assetIds.map((id) => parseInt(id));
    } else if (assetId) {
      targetAssetIds = [parseInt(assetId)];
    }

    if (targetAssetIds.length === 0) {
      return res.status(400).json({ error: "Asset ID(s) is required" });
    }

    try {
      // Calculate due date (default 7 days from now)
      const defaultDueDate = new Date();
      defaultDueDate.setDate(defaultDueDate.getDate() + 7);
      const finalDueDate = dueDate ? new Date(dueDate) : defaultDueDate;

      // Use transaction to ensure atomicity
      const result = await prisma.$transaction(async (tx) => {
        const createdLoans = [];

        for (const id of targetAssetIds) {
          // Check availability for each asset
          const asset = await tx.asset.findUnique({
            where: { id },
            include: {
              loans: {
                where: {
                  status: { in: ["PENDING", "APPROVED", "BORROWED"] },
                },
              },
            },
          });

          if (!asset) {
            throw new Error(`Asset ${id} not found`);
          }

          if (asset.status !== "AVAILABLE") {
            throw new Error(`Asset ${asset.name} is not available`);
          }

          if (asset.loans.length > 0) {
            throw new Error(
              `Asset ${asset.name} already has active loan requests`
            );
          }

          // Create Loan
          const loan = await tx.loan.create({
            data: {
              assetId: id,
              borrowerId: req.user.id,
              dueDate: finalDueDate,
              notes: notes || null,
              status: "PENDING",
            },
            include: {
              asset: true,
            },
          });

          // Create Log
          await tx.assetLog.create({
            data: {
              assetId: id,
              loanId: loan.id,
              action: "BORROWED", // Intentionally using 'BORROWED' as initial action per existing logic, or should change to 'REQUESTED'? Existing logic used 'BORROWED' log action for creation. Keeping consistency.
              userId: req.user.id,
              notes: "Loan requested (Batch)",
            },
          });

          createdLoans.push(loan);
        }

        return createdLoans;
      });

      res.status(201).json({ loans: result });
    } catch (error) {
      console.error("Create loan error:", error);
      // Determine if it's a known error
      if (
        error.message.includes("Asset") &&
        (error.message.includes("not found") ||
          error.message.includes("not available") ||
          error.message.includes("active loan"))
      ) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },
];
