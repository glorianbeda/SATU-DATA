const prisma = require("@/utils/prisma");
const authMiddleware = require("@/middleware/auth");

const handler = async (req, res) => {
  try {
    const { id } = req.params;

    const linkTree = await prisma.linkTree.findUnique({
      where: { userId: req.user.id },
    });

    if (!linkTree) {
      return res.status(404).json({ error: "Link tree not found" });
    }

    const existingItem = await prisma.linkTreeItem.findUnique({
      where: { id },
    });

    if (!existingItem || existingItem.linkTreeId !== linkTree.id) {
      return res.status(404).json({ error: "Item not found" });
    }

    await prisma.linkTreeItem.delete({
      where: { id },
    });

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting link tree item:", error);
    res.status(500).json({ error: "Failed to delete link tree item" });
  }
};

module.exports = [authMiddleware, handler];
