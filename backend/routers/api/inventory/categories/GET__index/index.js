const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");
const checkRole = require("@/middleware/checkRole");

const prisma = new PrismaClient();

module.exports = [
  authMiddleware,
  checkRole(["SUPER_ADMIN", "ADMIN", "KOORDINATOR_INVENTARIS"]),
  async (req, res) => {
    try {
      const categories = await prisma.assetCategory.findMany({
        orderBy: { createdAt: "desc" },
      });

      res.json({ categories });
    } catch (error) {
      console.error("Get categories error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
];
