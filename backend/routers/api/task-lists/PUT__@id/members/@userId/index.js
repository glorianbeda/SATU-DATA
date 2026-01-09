const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

/**
 * PUT /api/task-lists/:id/members/:userId
 * Update member permission (owner only)
 */
const handler = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const listId = parseInt(req.params.id);
    const targetUserId = parseInt(req.params.userId);
    const { permission } = req.body;

    if (!permission || !["VIEWER", "EDITOR"].includes(permission)) {
      return res
        .status(400)
        .json({ error: "Valid permission (VIEWER/EDITOR) is required" });
    }

    // Check ownership
    const taskList = await prisma.taskList.findUnique({
      where: { id: listId },
    });

    if (!taskList) {
      return res.status(404).json({ error: "TaskList not found" });
    }

    if (taskList.ownerId !== currentUserId) {
      return res
        .status(403)
        .json({ error: "Only owner can update permissions" });
    }

    // Find membership
    const member = await prisma.taskListMember.findUnique({
      where: {
        taskListId_userId: { taskListId: listId, userId: targetUserId },
      },
    });

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    // Update permission
    await prisma.taskListMember.update({
      where: { id: member.id },
      data: { permission },
    });

    res.json({ message: "Permission updated", permission });
  } catch (error) {
    console.error("Update permission error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
