const prisma = require("@/utils/prisma");
const authMiddleware = require("@/middleware/auth");

const handler = async (req, res) => {
  try {
    const { title, url, icon } = req.body;

    if (!title || !url) {
      return res.status(400).json({ error: "Title and URL are required" });
    }

    const linkTree = await prisma.linkTree.findUnique({
      where: { userId: req.user.id },
    });

    if (!linkTree) {
      return res.status(404).json({ error: "Link tree not found" });
    }

    const lastItem = await prisma.linkTreeItem.findFirst({
      where: { linkTreeId: linkTree.id },
      orderBy: { order: "desc" },
    });

    const newOrder = lastItem ? lastItem.order + 1 : 0;

    const item = await prisma.linkTreeItem.create({
      data: {
        linkTreeId: linkTree.id,
        title,
        url,
        icon: icon || null,
        order: newOrder,
      },
    });

    res.json({ item });
  } catch (error) {
    console.error("Error creating link tree item:", error);
    res.status(500).json({ error: "Failed to create link tree item" });
  }
};

module.exports = [authMiddleware, handler];
