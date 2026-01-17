const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");
const checkRole = require("@/middleware/checkRole");

const prisma = new PrismaClient();

module.exports = [
  authMiddleware,
  checkRole(["SUPER_ADMIN"]),
  async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    try {
      const category = await prisma.assetCategory.update({
        where: { id: parseInt(id, 10) },
        data: { name },
      });

      res.json({ category });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Category not found" });
      }
      console.error("Update category error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
];
