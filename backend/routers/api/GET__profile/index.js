const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

const cache = require("@/utils/cache");

const handler = async (req, res) => {
  try {
    const userId = req.user.id;
    const cacheKey = `profile:${userId}`;

    // Clear old cache on every fetch to ensure role data stays fresh
    // This can be optimized later with cache invalidation on role change
    await cache.del(cacheKey);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        sign: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2. Save to cache
    await cache.set(cacheKey, user);

    res.json({ user: user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
