const prisma = require("@/utils/prisma");

const handler = async (req, res) => {
  try {
    const { username } = req.params;

    const linkTree = await prisma.linkTree.findFirst({
      where: {
        title: { 
          equals: username.replace(/-/g, ' '), 
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
          },
        },
        items: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!linkTree) {
      return res.status(404).json({ error: "Link tree not found" });
    }

    if (!linkTree.isShared) {
      return res.status(403).json({ error: "Link tree is not shared" });
    }

    res.json({
      linkTree: {
        ...linkTree,
        user: {
          name: linkTree.user.name,
          profilePicture: linkTree.user.profilePicture,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching link tree:", error);
    res.status(500).json({ error: "Failed to fetch link tree" });
  }
};

module.exports = handler;
