const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");
const checkRole = require("@/middleware/checkRole");

const prisma = new PrismaClient();

module.exports = [
  authMiddleware,
  checkRole(["SUPER_ADMIN", "ADMIN"]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const logs = await prisma.assetLog.findMany({
        where: { assetId: parseInt(id) },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          loan: {
            include: {
              borrower: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { actionDate: "desc" },
      });

      res.json({ logs });
    } catch (error) {
      console.error("Get asset history error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
];
