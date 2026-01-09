const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

/**
 * PUT /api/tasks/:id
 * Update a task (editor access required)
 */
const handler = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = parseInt(req.params.id);
    const {
      title,
      description,
      status,
      order,
      priority,
      category,
      dueDate,
      assigneeId,
    } = req.body;

    // Get task and verify editor access to its TaskList
    const existing = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        taskList: {
          include: {
            members: { where: { userId } },
          },
        },
      },
    });

    if (!existing) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if user has editor access
    const isOwner = existing.taskList.ownerId === userId;
    const isEditor = existing.taskList.members.some(
      (m) => m.permission === "EDITOR"
    );

    if (!isOwner && !isEditor) {
      return res.status(403).json({ error: "No editor access to this task" });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined)
      updateData.description = description?.trim() || null;
    if (priority !== undefined) updateData.priority = priority;
    if (category !== undefined) updateData.category = category?.trim() || null;
    if (dueDate !== undefined)
      updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (order !== undefined) updateData.order = order;

    // Handle assignee change
    if (assigneeId !== undefined) {
      if (assigneeId === null) {
        updateData.assigneeId = null;
      } else {
        // Verify assignee is a member of the TaskList
        const isMember =
          existing.taskList.ownerId === parseInt(assigneeId) ||
          (await prisma.taskListMember.findFirst({
            where: {
              taskListId: existing.taskListId,
              userId: parseInt(assigneeId),
            },
          }));

        if (!isMember) {
          return res
            .status(400)
            .json({ error: "Assignee must be a member of the TaskList" });
        }
        updateData.assigneeId = parseInt(assigneeId);
      }
    }

    // Handle status change with completedAt tracking
    if (status !== undefined) {
      updateData.status = status;
      if (status === "COMPLETED" && existing.status !== "COMPLETED") {
        updateData.completedAt = new Date();
      } else if (status !== "COMPLETED" && existing.status === "COMPLETED") {
        updateData.completedAt = null;
      }
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        taskList: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
      },
    });

    res.json({ task });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
