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

    // Get user name from database to ensure we have the correct name
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    const userName = user?.name || req.user.name || req.user.email.split('@')[0];
    
    // Update title if it contains "undefined"
    let updatedLinkTree = linkTree;
    if (linkTree.title?.includes('undefined') || !linkTree.title) {
      updatedLinkTree = await prisma.linkTree.update({
        where: { id: linkTree.id },
        data: {
          title: `${userName}'s Link Tree`,
        },
        include: {
          items: {
            orderBy: { order: "asc" },
          },
        },
      });
    }

    res.json({ linkTree: updatedLinkTree });
  } catch (error) {
    console.error("Error fixing link tree title:", error);
    res.status(500).json({ error: "Failed to fix link tree title" });
  }
};

module.exports = [authMiddleware, handler];
