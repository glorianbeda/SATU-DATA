const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, content, color, isPinned, coverImage } = req.body;

    const note = await prisma.note.create({
      data: {
        userId,
        title: title || "Untitled",
        content: content || "",
        color: color || "default",
        isPinned: isPinned || false,
        coverImage: coverImage || null,
      },
    });

    res.status(201).json({ note });
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
