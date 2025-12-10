const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");
const uploadImage = require("@/middleware/uploadImage");

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    const { type, amount, description, category, date } = req.body;
    let proofImage = null;

    if (req.file) {
      proofImage = `/uploads/finance/${req.file.filename}`;
    }

    if (!type || !amount || !description || !category || !date) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount: parseFloat(amount),
        description,
        category,
        date: new Date(date),
        proofImage,
        createdById: req.user.id,
      },
    });

    res.json({ message: "Transaction created", transaction });
  } catch (error) {
    console.error("Create transaction error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, uploadImage.single("proof"), handler];
