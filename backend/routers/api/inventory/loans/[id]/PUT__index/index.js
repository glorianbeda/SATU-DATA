const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");
const checkRole = require("@/middleware/checkRole");

const prisma = new PrismaClient();

module.exports = [
  authMiddleware,
  checkRole(["SUPER_ADMIN", "ADMIN", "KOORDINATOR_INVENTARIS"]),
  async (req, res) => {
    const { id } = req.params;
    const { status, requestDate, borrowedDate, dueDate, returnedDate, notes } =
      req.body;

    try {
      const loan = await prisma.loan.findUnique({
        where: { id: parseInt(id) },
      });

      if (!loan) {
        return res.status(404).json({ error: "Loan not found" });
      }

      // Prepare update data
      const updateData = {};
      if (status) updateData.status = status;
      if (requestDate) updateData.requestDate = new Date(requestDate);
      if (borrowedDate) updateData.borrowedDate = new Date(borrowedDate);
      if (dueDate) updateData.dueDate = new Date(dueDate);
      if (returnedDate) updateData.returnedDate = new Date(returnedDate);
      // Explicitly allow setting notes to empty string if needed, or update if provided
      if (notes !== undefined) updateData.notes = notes;

      // Also update asset status if loan status implies it?
      // For now, trust the admin knows what they are doing.
      // But ideally, if status changes to RETURNED, asset should be AVAILABLE.
      // If status changes to BORROWED, asset should be BORROWED.
      // This logic is complex for a simple edit.
      // I will only update the Loan fields for now.
      // Use "notes" to log that this was a manual edit.

      const updatedLoan = await prisma.loan.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

      // Log the update
      await prisma.loanLog.create({
        data: {
          loanId: parseInt(id),
          userId: req.user.id,
          action: "UPDATED_MANUALLY",
          notes: `Loan updated by admin. Changes: ${Object.keys(
            updateData
          ).join(", ")}`,
        },
      });

      res.status(200).json({
        message: "Loan updated successfully",
        loan: updatedLoan,
      });
    } catch (error) {
      console.error("Error updating loan:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
];
