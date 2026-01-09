const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

/**
 * DELETE /api/tasks/:id
 * Delete a task (editor access required)
 */
const handler = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = parseInt(req.params.id);

    // Get task and verify editor access
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
      return res
        .status(403)
        .json({ error: "No editor access to delete this task" });
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
