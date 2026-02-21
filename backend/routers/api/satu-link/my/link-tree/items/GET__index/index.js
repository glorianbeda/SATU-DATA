const prisma = require("@/utils/prisma");
const authMiddleware = require("@/middleware/auth");

const handler = async (req, res) => {
  try {
    const linkTree = await prisma.linkTree.findUnique({
      where: { userId: req.user.id },
    });

    if (!linkTree) {
      return res.status(404).json({ error: "Link tree not found" });
    }

    const items = await prisma.linkTreeItem.findMany({
      where: { linkTreeId: linkTree.id },
      orderBy: { order: "asc" },
    });

    res.json({ items });
  } catch (error) {
    console.error("Error fetching link tree items:", error);
    res.status(500).json({ error: "Failed to fetch link tree items" });
  }
};

module.exports = [authMiddleware, handler];
