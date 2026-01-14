const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");
const checkRole = require("@/middleware/checkRole");

const prisma = new PrismaClient();

module.exports = [authMiddleware, checkRole(["SUPER_ADMIN", "ADMIN"]), async (req, res) => {
  const { id } = req.params;

  try {
    // Check if category has any assets
    const assetCount = await prisma.asset.count({
      where: { categoryId: parseInt(id) },
    });

    if (assetCount > 0) {
      return res.status(400).json({
        error: "Cannot delete category with existing assets",
      });
    }

    await prisma.assetCategory.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}];
