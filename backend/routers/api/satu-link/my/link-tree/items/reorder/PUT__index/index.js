const prisma = require("@/utils/prisma");
const authMiddleware = require("@/middleware/auth");

const handler = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Items array is required" });
    }

    const linkTree = await prisma.linkTree.findUnique({
      where: { userId: req.user.id },
    });

    if (!linkTree) {
      return res.status(404).json({ error: "Link tree not found" });
    }

    for (const item of items) {
      await prisma.linkTreeItem.updateMany({
        where: { id: item.id, linkTreeId: linkTree.id },
        data: { order: item.order },
      });
    }

    const updatedItems = await prisma.linkTreeItem.findMany({
      where: { linkTreeId: linkTree.id },
      orderBy: { order: "asc" },
    });

    res.json({ items: updatedItems });
  } catch (error) {
    console.error("Error reordering link tree items:", error);
    res.status(500).json({ error: "Failed to reorder link tree items" });
  }
};

module.exports = [authMiddleware, handler];
