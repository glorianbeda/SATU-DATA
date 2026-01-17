const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

module.exports = [
  authMiddleware,
  async (req, res) => {
    const { id } = req.params;
    const { returnCondition, returnNotes } = req.body;

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

      // Check permissions
      const isAdmin = [
        "SUPER_ADMIN",
        "ADMIN",
        "KOORDINATOR_INVENTARIS",
      ].includes(req.user.role.name);
      const isBorrower = loan.borrowerId === req.user.id;

      if (!isAdmin && !isBorrower) {
        return res.status(403).json({ error: "Access denied" });
      }

      if (loan.status !== "BORROWED") {
        return res.status(400).json({
          error: `Loan cannot be returned. Current status: ${loan.status}`,
        });
      }

      // Update asset status based on return condition
      let newAssetStatus = "AVAILABLE";
      if (returnCondition === "DAMAGED") {
        newAssetStatus = "MAINTENANCE";
      } else if (returnCondition === "LOST") {
        newAssetStatus = "LOST";
      }

      const { returnProofImage } = req.body;

      if (returnProofImage) {
        // Flow with proof: Set to RETURN_VERIFICATION
        await prisma.loan.update({
          where: { id: parseInt(id) },
          data: {
            status: "RETURN_VERIFICATION",
            returnProofImage,
            returnCondition: returnCondition || "GOOD",
            returnNotes: returnNotes || null,
          },
        });

        // Create asset log
        await prisma.assetLog.create({
          data: {
            assetId: loan.assetId,
            loanId: loan.id,
            action: "RETURN_VERIFICATION",
            userId: req.user.id,
            notes: `Return verification requested. Notes: ${
              returnNotes || "-"
            }`,
          },
        });
      } else {
        // Direct return flow (Admin only or legacy)
        if (!isAdmin) {
          return res
            .status(400)
            .json({ error: "Return proof image is required" });
        }

        // Update loan and asset status
        await prisma.$transaction([
          prisma.loan.update({
            where: { id: parseInt(id) },
            data: {
              status: "RETURNED",
              returnedDate: new Date(),
              returnCondition: returnCondition || "GOOD",
              returnNotes: returnNotes || null,
            },
          }),
          prisma.asset.update({
            where: { id: loan.assetId },
            data: {
              status: newAssetStatus,
            },
          }),
        ]);

        // Create asset log
        await prisma.assetLog.create({
          data: {
            assetId: loan.assetId,
            loanId: loan.id,
            action: "RETURNED",
            userId: req.user.id,
            notes: `Asset returned. Condition: ${returnCondition || "GOOD"}${
              returnNotes ? `. Notes: ${returnNotes}` : ""
            }`,
          },
        });
      }

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
      console.error("Return loan error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
];
