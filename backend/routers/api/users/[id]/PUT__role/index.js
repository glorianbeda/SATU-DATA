const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

const checkRole = require("@/middleware/checkRole");

const handler = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { roleId } = req.body;

    if (!roleId) {
      return res.status(400).json({ error: "Role ID is required" });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prevent changing own role (security)
    if (user.id === req.user.id) {
      return res.status(400).json({ error: "Cannot change your own role" });
    }

    // Verify role exists
    const role = await prisma.role.findUnique({
      where: { id: parseInt(roleId) },
    });

    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    // Only allow ONE Super Admin
    if (role.name === "SUPER_ADMIN") {
      const existingSuperAdmin = await prisma.user.findFirst({
        where: {
          role: { name: "SUPER_ADMIN" },
          id: { not: userId }, // Exclude current user being updated
        },
      });
      if (existingSuperAdmin) {
        return res.status(400).json({
          error:
            "Only one Super Admin is allowed. Please demote the existing Super Admin first.",
        });
      }
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { roleId: parseInt(roleId) },
      include: { role: true },
    });

    res.json({
      message: "User role updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role.name,
      },
    });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, checkRole(["SUPER_ADMIN"]), handler];
