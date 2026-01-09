const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

/**
 * GET /api/task-lists
 * List user's TaskLists (owned + member of)
 */
const handler = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get TaskLists where user is owner OR member
    const taskLists = await prisma.taskList.findMany({
      where: {
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
      include: {
        owner: { select: { id: true, name: true } },
        members: {
          include: { user: { select: { id: true, name: true } } },
        },
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Format response
    const result = taskLists.map((list) => ({
      id: list.id,
      name: list.name,
      description: list.description,
      owner: list.owner,
      isOwner: list.ownerId === userId,
      members: list.members.map((m) => ({
        userId: m.userId,
        name: m.user.name,
        permission: m.permission,
        invitedAt: m.invitedAt,
      })),
      taskCount: list._count.tasks,
      createdAt: list.createdAt,
      updatedAt: list.updatedAt,
    }));

    res.json({ taskLists: result });
  } catch (error) {
    console.error("Get task lists error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
