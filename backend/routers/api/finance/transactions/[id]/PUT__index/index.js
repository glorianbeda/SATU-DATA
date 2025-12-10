const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, description, category, date } = req.body;

    const transaction = await prisma.transaction.update({
      where: { id: parseInt(id) },
      data: {
        type,
        amount: parseFloat(amount),
        description,
        category,
        date: new Date(date),
      },
    });

    res.json({ message: "Transaction updated", transaction });
  } catch (error) {
    console.error("Update transaction error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
