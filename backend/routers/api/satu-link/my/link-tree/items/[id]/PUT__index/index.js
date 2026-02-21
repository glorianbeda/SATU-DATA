const prisma = require("@/utils/prisma");
const authMiddleware = require("@/middleware/auth");

const handler = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, icon, isActive } = req.body;

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

    const item = await prisma.linkTreeItem.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(url && { url }),
        ...(icon !== undefined && { icon }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.json({ item });
  } catch (error) {
    console.error("Error updating link tree item:", error);
    res.status(500).json({ error: "Failed to update link tree item" });
  }
};

module.exports = [authMiddleware, handler];
