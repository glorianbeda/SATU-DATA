const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");
const checkRole = require("@/middleware/checkRole");

const prisma = new PrismaClient();

module.exports = [
  authMiddleware,
  checkRole(["SUPER_ADMIN"]),
  async (req, res) => {
    const { name, code } = req.body;

    if (!name || !code) {
      return res.status(400).json({ error: "Name and code are required" });
    }

    try {
      const category = await prisma.assetCategory.create({
        data: {
          name,
          code: code.toUpperCase(),
        },
      });

      res.status(201).json({ category });
    } catch (error) {
      if (error.code === "P2002") {
        return res.status(400).json({ error: "Category code already exists" });
      }
      console.error("Create category error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
];
