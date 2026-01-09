const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

/**
 * POST /api/task-lists
 * Create a new TaskList
 */
const handler = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Name is required" });
    }

    const taskList = await prisma.taskList.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        ownerId: userId,
      },
      include: {
        owner: { select: { id: true, name: true } },
      },
    });

    res.status(201).json({
      id: taskList.id,
      name: taskList.name,
      description: taskList.description,
      owner: taskList.owner,
      isOwner: true,
      members: [],
      taskCount: 0,
      createdAt: taskList.createdAt,
      updatedAt: taskList.updatedAt,
    });
  } catch (error) {
    console.error("Create task list error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
