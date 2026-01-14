const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

module.exports = [
  authMiddleware,
  async (req, res) => {
    const { id } = req.params;
    const userRole = req.user.role.name;
    const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(userRole);

    try {
      // Check permissions - users can only see their own history, admins can see any user's history
      if (!isAdmin && req.user.id !== parseInt(id)) {
        return res.status(403).json({ error: "Access denied" });
      }

      const logs = await prisma.assetLog.findMany({
        where: { userId: parseInt(id) },
        include: {
          asset: {
            include: {
              category: true,
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
      console.error("Get user history error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
];
