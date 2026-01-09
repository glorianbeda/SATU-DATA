const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

/**
 * PUT /api/task-lists/:id
 * Update a TaskList (owner only)
 */
const handler = async (req, res) => {
  try {
    const userId = req.user.id;
    const listId = parseInt(req.params.id);
    const { name, description } = req.body;

    // Check ownership
    const taskList = await prisma.taskList.findUnique({
      where: { id: listId },
    });

    if (!taskList) {
      return res.status(404).json({ error: "TaskList not found" });
    }

    if (taskList.ownerId !== userId) {
      return res.status(403).json({ error: "Only owner can update TaskList" });
    }

    const updated = await prisma.taskList.update({
      where: { id: listId },
      data: {
        name: name?.trim() || taskList.name,
        description:
          description !== undefined
            ? description?.trim() || null
            : taskList.description,
      },
    });

    res.json({
      id: updated.id,
      name: updated.name,
      description: updated.description,
      updatedAt: updated.updatedAt,
    });
  } catch (error) {
    console.error("Update task list error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
