const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    const userId = req.user.id;

    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
      select: {
        id: true,
        title: true,
        content: true,
        isPinned: true,
        color: true,
        coverImage: true,
        updatedAt: true,
        createdAt: true,
      },
    });

    res.json({ notes });
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
