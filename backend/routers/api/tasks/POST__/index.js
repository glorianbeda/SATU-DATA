const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

/**
 * POST /api/tasks
 * Create a new task in a TaskList
 */
const handler = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      taskListId,
      title,
      description,
      priority,
      category,
      dueDate,
      assigneeId,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!taskListId) {
      return res.status(400).json({ error: "taskListId is required" });
    }

    // Verify user has EDITOR access to this list
    const taskList = await prisma.taskList.findFirst({
      where: {
        id: parseInt(taskListId),
        OR: [
          { ownerId: userId },
          { members: { some: { userId, permission: "EDITOR" } } },
        ],
      },
    });

    if (!taskList) {
      return res
        .status(403)
        .json({ error: "No editor access to this TaskList" });
    }

    // If assigneeId provided, verify they are a member
    if (assigneeId) {
      const isMember =
        taskList.ownerId === parseInt(assigneeId) ||
        (await prisma.taskListMember.findFirst({
          where: { taskListId: taskList.id, userId: parseInt(assigneeId) },
        }));

      if (!isMember) {
        return res
          .status(400)
          .json({ error: "Assignee must be a member of the TaskList" });
      }
    }

    // Get max order for pending tasks in this list
    const maxOrder = await prisma.task.aggregate({
      where: { taskListId: taskList.id, status: "PENDING" },
      _max: { order: true },
    });

    const task = await prisma.task.create({
      data: {
        taskListId: taskList.id,
        title: title.trim(),
        description: description?.trim() || null,
        status: "PENDING",
        priority: priority || "MEDIUM",
        category: category?.trim() || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        assigneeId: assigneeId ? parseInt(assigneeId) : null,
        order: (maxOrder._max.order || 0) + 1,
      },
      include: {
        taskList: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
      },
    });

    res.status(201).json({ task });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
