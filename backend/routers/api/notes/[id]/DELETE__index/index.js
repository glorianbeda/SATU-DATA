const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    const userId = req.user.id;
    const noteId = parseInt(req.params.id);

    // Verify ownership
    const existing = await prisma.note.findFirst({
      where: { id: noteId, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Note not found" });
    }

    await prisma.note.delete({
      where: { id: noteId },
    });

    res.json({ message: "Note deleted" });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
