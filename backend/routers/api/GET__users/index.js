const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

const checkRole = require("@/middleware/checkRole");

const handler = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      role,
      exclude_self,
    } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const where = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (role) {
      where.role = { name: role };
    }

    if (exclude_self === "true") {
      where.id = { not: req.user.id };
    }

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          createdAt: true,
          role: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    // Get all roles for dropdown
    const roles = await prisma.role.findMany({
      select: { id: true, name: true },
    });

    res.json({
      users,
      roles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, checkRole(["SUPER_ADMIN"]), handler];
