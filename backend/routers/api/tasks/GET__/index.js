const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

/**
 * GET /api/tasks
 * List tasks with filtering by taskListId, assignedToMe, etc.
 */
const handler = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      taskListId,
      assignedToMe,
      status,
      priority,
      category,
      search,
      sortBy,
      sortOrder,
    } = req.query;

    // Build where clause
    const where = {};

    // If taskListId specified, filter by it (and verify access)
    if (taskListId) {
      const listId = parseInt(taskListId);

      // Verify user has access to this list
      const taskList = await prisma.taskList.findFirst({
        where: {
          id: listId,
          OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        },
      });

      if (!taskList) {
        return res
          .status(403)
          .json({ error: "Access denied to this TaskList" });
      }

      where.taskListId = listId;
    } else {
      // Get all tasks from lists user has access to
      const accessibleLists = await prisma.taskList.findMany({
        where: {
          OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        },
        select: { id: true },
      });

      where.taskListId = { in: accessibleLists.map((l) => l.id) };
    }

    // Filter by assigned to me
    if (assignedToMe === "true") {
      where.assigneeId = userId;
    }

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category) where.category = category;
    if (search) {
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
          ],
        },
      ];
    }

    // Build orderBy
    let orderBy = [{ status: "asc" }, { order: "asc" }, { createdAt: "desc" }];
    if (sortBy) {
      const order = sortOrder === "desc" ? "desc" : "asc";
      switch (sortBy) {
        case "dueDate":
          orderBy = [{ dueDate: order }];
          break;
        case "priority":
          orderBy = [{ priority: order }];
          break;
        case "createdAt":
          orderBy = [{ createdAt: order }];
          break;
        case "title":
          orderBy = [{ title: order }];
          break;
      }
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy,
      include: {
        taskList: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
      },
    });

    res.json({ tasks });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
