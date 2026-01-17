const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");
const checkRole = require("@/middleware/checkRole");

const prisma = new PrismaClient();

module.exports = [
  authMiddleware,
  checkRole(["SUPER_ADMIN", "ADMIN", "KOORDINATOR_INVENTARIS"]),
  async (req, res) => {
    const { id } = req.params;
    const { decision, notes, returnCondition } = req.body; // decision: "APPROVE" | "REJECT"

    if (!["APPROVE", "REJECT"].includes(decision)) {
      return res
        .status(400)
        .json({ error: "Invalid decision. Must be APPROVE or REJECT" });
    }

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

      if (loan.status !== "RETURN_VERIFICATION") {
        return res.status(400).json({
          error: `Loan is not in verification status. Current status: ${loan.status}`,
        });
      }

      if (decision === "APPROVE") {
        // Finalize Return
        let newAssetStatus = "AVAILABLE";
        if (returnCondition === "DAMAGED") {
          newAssetStatus = "MAINTENANCE";
        } else if (returnCondition === "LOST") {
          newAssetStatus = "LOST";
        } else if (loan.returnCondition === "DAMAGED") {
          // Fallback to loan's stored condition if passed
          newAssetStatus = "MAINTENANCE";
        } else if (loan.returnCondition === "LOST") {
          newAssetStatus = "LOST";
        }

        await prisma.$transaction([
          prisma.loan.update({
            where: { id: parseInt(id) },
            data: {
              status: "RETURNED",
              returnedDate: new Date(),
              // If admin provides new condition/notes, update them, otherwise keep existing
              returnCondition:
                returnCondition || loan.returnCondition || "GOOD",
              returnNotes: notes || loan.returnNotes,
              approvedById: req.user.id, // Track who verified? field approvedById is for loan approval. Maybe add verifiedById later? standard approvedById is likely reused or just log it.
            },
          }),
          prisma.asset.update({
            where: { id: loan.assetId },
            data: {
              status: newAssetStatus,
            },
          }),
        ]);

        await prisma.assetLog.create({
          data: {
            assetId: loan.assetId,
            loanId: loan.id,
            action: "RETURN_VERIFIED",
            userId: req.user.id,
            notes: `Return verified and approved. Notes: ${notes || "-"}`,
          },
        });
      } else {
        // REJECT -> Revert to BORROWED
        await prisma.loan.update({
          where: { id: parseInt(id) },
          data: {
            status: "BORROWED",
            // returnProofImage: null, // Should we clear proof? Maybe keep it for history or clear it to force new upload. Spec doesn't say. Let's keep it but status change implies re-do.
            // Actually, if rejected, user needs to re-upload.
          },
        });

        await prisma.assetLog.create({
          data: {
            assetId: loan.assetId,
            loanId: loan.id,
            action: "RETURN_REJECTED",
            userId: req.user.id,
            notes: `Return verification rejected. Notes: ${notes || "-"}`,
          },
        });
      }

      const updatedLoan = await prisma.loan.findUnique({
        where: { id: parseInt(id) },
        include: { asset: true, borrower: true },
      });

      res.json({ loan: updatedLoan });
    } catch (error) {
      console.error("Verify return error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
];
