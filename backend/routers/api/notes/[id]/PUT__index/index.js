const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    const userId = req.user.id;
    const noteId = parseInt(req.params.id);
    const { title, content, color, isPinned, coverImage } = req.body;

    // Verify ownership
    const existing = await prisma.note.findFirst({
      where: { id: noteId, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Note not found" });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (color !== undefined) updateData.color = color;
    if (isPinned !== undefined) updateData.isPinned = isPinned;
    if (coverImage !== undefined) updateData.coverImage = coverImage;

    const note = await prisma.note.update({
      where: { id: noteId },
      data: updateData,
    });

    res.json({ note });
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
