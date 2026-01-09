const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

/**
 * PUT /api/tasks/reorder
 * Batch reorder tasks within a TaskList
 */
const handler = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskListId, tasks } = req.body; // tasks: Array of { id, status, order }

    if (!taskListId) {
      return res.status(400).json({ error: "taskListId is required" });
    }

    if (!Array.isArray(tasks)) {
      return res.status(400).json({ error: "Tasks array is required" });
    }

    // Verify editor access to TaskList
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

    // Update each task (only those in this TaskList)
    await Promise.all(
      tasks.map((t) =>
        prisma.task.updateMany({
          where: { id: t.id, taskListId: taskList.id },
          data: { status: t.status, order: t.order },
        })
      )
    );

    res.json({ message: "Tasks reordered" });
  } catch (error) {
    console.error("Reorder tasks error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
