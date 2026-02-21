const prisma = require("@/utils/prisma");
const authMiddleware = require("@/middleware/auth");
const { generateRandomCode, isValidUrl } = require("@/utils/shortCodeGenerator");

const handler = async (req, res) => {
  try {
    const shortLinks = await prisma.shortLink.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ shortLinks });
  } catch (error) {
    console.error("Error fetching short links:", error);
    res.status(500).json({ error: "Failed to fetch short links" });
  }
};

module.exports = [authMiddleware, handler];
