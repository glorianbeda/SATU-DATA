const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

/**
 * DELETE /api/task-lists/:id
 * Delete a TaskList (owner only)
 */
const handler = async (req, res) => {
  try {
    const userId = req.user.id;
    const listId = parseInt(req.params.id);

    // Check ownership
    const taskList = await prisma.taskList.findUnique({
      where: { id: listId },
    });

    if (!taskList) {
      return res.status(404).json({ error: "TaskList not found" });
    }

    if (taskList.ownerId !== userId) {
      return res.status(403).json({ error: "Only owner can delete TaskList" });
    }

    // Check if this is the only TaskList (don't allow deleting the last one)
    const count = await prisma.taskList.count({
      where: { ownerId: userId },
    });

    if (count <= 1) {
      return res
        .status(400)
        .json({ error: "Cannot delete your only TaskList" });
    }

    await prisma.taskList.delete({
      where: { id: listId },
    });

    res.json({ message: "TaskList deleted successfully" });
  } catch (error) {
    console.error("Delete task list error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
