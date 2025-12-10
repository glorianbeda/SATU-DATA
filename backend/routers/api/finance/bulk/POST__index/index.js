const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    const { transactions, type } = req.body;

    if (
      !transactions ||
      !Array.isArray(transactions) ||
      transactions.length === 0
    ) {
      return res.status(400).json({ error: "Invalid transactions data" });
    }

    if (!type || !["INCOME", "EXPENSE"].includes(type)) {
      return res.status(400).json({ error: "Invalid transaction type" });
    }

    // Prepare data for bulk insert
    const records = transactions.map((t) => {
      // Basic validation for each record
      if (!t.Date || !t.Amount || !t.Category || !t.Description) {
        throw new Error("Missing required fields in one of the records");
      }

      // Parse amount (remove currency symbols, dots, etc if needed, but frontend should handle clean up)
      // Assuming frontend sends clean numbers or strings
      let amount = t.Amount;
      if (typeof amount === "string") {
        amount = parseFloat(amount.replace(/[^0-9.-]+/g, ""));
      }

      // Parse date
      // Excel dates might be serial numbers or strings.
      // If frontend sends raw strings like "2023-12-01", it's fine.
      // If it sends "DD/MM/YYYY", we need to parse.
      // For now, let's assume the frontend sends a valid date string or we try to parse it.
      const date = new Date(t.Date);
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date format: ${t.Date}`);
      }

      return {
        type,
        amount,
        description: t.Description,
        category: t.Category,
        date,
        createdById: req.user.id,
      };
    });

    const result = await prisma.transaction.createMany({
      data: records,
    });

    res.json({ message: "Bulk import successful", count: result.count });
  } catch (error) {
    console.error("Bulk import error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
