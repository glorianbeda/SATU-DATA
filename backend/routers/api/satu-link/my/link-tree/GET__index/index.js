const prisma = require("@/utils/prisma");
const authMiddleware = require("@/middleware/auth");

const handler = async (req, res) => {
  try {
    let linkTree = await prisma.linkTree.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!linkTree) {
      // Fallback to email username if name is undefined
      const userName = req.user.name || req.user.email.split('@')[0];
      linkTree = await prisma.linkTree.create({
        data: {
          userId: req.user.id,
          title: `${userName}'s Link Tree`,
          isShared: false,
        },
        include: {
          items: true,
        },
      });
    }

    res.json({ linkTree });
  } catch (error) {
    console.error("Error fetching link tree:", error);
    res.status(500).json({ error: "Failed to fetch link tree" });
  }
};

module.exports = [authMiddleware, handler];
