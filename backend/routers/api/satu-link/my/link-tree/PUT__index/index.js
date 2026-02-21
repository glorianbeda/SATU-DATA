const prisma = require("@/utils/prisma");
const authMiddleware = require("@/middleware/auth");

const handler = async (req, res) => {
  try {
    const { title, bio, avatar, isShared } = req.body;

    let linkTree = await prisma.linkTree.findUnique({
      where: { userId: req.user.id },
    });

    if (!linkTree) {
      linkTree = await prisma.linkTree.create({
        data: {
          userId: req.user.id,
          title: title || `${req.user.name}'s Link Tree`,
          bio: bio || null,
          avatar: avatar || null,
          isShared: isShared || false,
        },
        include: {
          items: {
            orderBy: { order: "asc" },
          },
        },
      });
    } else {
      linkTree = await prisma.linkTree.update({
        where: { id: linkTree.id },
        data: {
          ...(title && { title }),
          ...(bio !== undefined && { bio }),
          ...(avatar !== undefined && { avatar }),
          ...(isShared !== undefined && { isShared }),
        },
        include: {
          items: {
            orderBy: { order: "asc" },
          },
        },
      });
    }

    res.json({ linkTree });
  } catch (error) {
    console.error("Error updating link tree:", error);
    res.status(500).json({ error: "Failed to update link tree" });
  }
};

module.exports = [authMiddleware, handler];
