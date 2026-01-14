const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

/**
 * GET /api/task-lists/:id/members
 * List members of a TaskList
 */
const handler = async (req, res) => {
  try {
    const userId = req.user.id;
    const listId = parseInt(req.params.id);

    // Check access (owner or member)
    const taskList = await prisma.taskList.findUnique({
      where: { id: listId },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });

    if (!taskList) {
      return res.status(404).json({ error: "TaskList not found" });
    }

    const isMember =
      taskList.ownerId === userId ||
      taskList.members.some((m) => m.userId === userId);

    if (!isMember) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Return owner + members
    const members = [
      {
        userId: taskList.owner.id,
        name: taskList.owner.name,
        email: taskList.owner.email,
        permission: "OWNER",
        isOwner: true,
      },
      ...taskList.members.map((m) => ({
        userId: m.user.id,
        name: m.user.name,
        email: m.user.email,
        permission: m.permission,
        isOwner: false,
        invitedAt: m.invitedAt,
      })),
    ];

    res.json({ members });
  } catch (error) {
    console.error("Get members error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
