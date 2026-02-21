const prisma = require("@/utils/prisma");
const authMiddleware = require("@/middleware/auth");

const handler = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.shortLink.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Short link not found" });
    }

    if (existing.userId !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await prisma.shortLink.delete({
      where: { id },
    });

    res.json({ message: "Short link deleted successfully" });
  } catch (error) {
    console.error("Error deleting short link:", error);
    res.status(500).json({ error: "Failed to delete short link" });
  }
};

module.exports = [authMiddleware, handler];
