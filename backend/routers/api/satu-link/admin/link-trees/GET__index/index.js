const prisma = require("@/utils/prisma");
const authMiddleware = require("@/middleware/auth");

const handler = async (req, res) => {
  try {
    const linkTrees = await prisma.linkTree.findMany({
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
          orderBy: { order: "asc" },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ linkTrees });
  } catch (error) {
    console.error("Error fetching link trees:", error);
    res.status(500).json({ error: "Failed to fetch link trees" });
  }
};

module.exports = [authMiddleware, handler];
