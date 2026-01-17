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

      // Prevent deletion if items are currently borrowed or in verification
      if (["BORROWED", "RETURN_VERIFICATION"].includes(loan.status)) {
        return res.status(400).json({
          error: `Cannot delete loan with status ${loan.status}`,
        });
      }

      await prisma.loan.delete({
        where: { id: parseInt(id) },
      });

      // Log the deletion if needed, or if asset status needs reset (usually not needed for pending loans that didn't affect stock yet)

      res.json({ message: "Loan deleted successfully" });
    } catch (error) {
      console.error("Delete loan error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
];
