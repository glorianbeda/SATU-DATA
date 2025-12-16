const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");
const uploadImage = require("@/middleware/uploadImage");

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, description, category, date } = req.body;

    const updateData = {
      type,
      amount: parseFloat(amount),
      description,
      category,
      date: new Date(date),
    };

    // Only update proofImage if a new file is uploaded
    if (req.file) {
      updateData.proofImage = `/uploads/finance/${req.file.filename}`;
    }

    const transaction = await prisma.transaction.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json({ message: "Transaction updated", transaction });
  } catch (error) {
    console.error("Update transaction error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, uploadImage.single("proof"), handler];
