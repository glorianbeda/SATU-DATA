const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

/**
 * DELETE /api/task-lists/:id/members/:userId
 * Remove member from TaskList (owner only, or member leaving)
 */
const handler = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const listId = parseInt(req.params.id);
    const targetUserId = parseInt(req.params.userId);

    // Get TaskList
    const taskList = await prisma.taskList.findUnique({
      where: { id: listId },
    });

    if (!taskList) {
      return res.status(404).json({ error: "TaskList not found" });
    }

    // Check permission: owner can remove anyone, member can only leave (remove self)
    const isOwner = taskList.ownerId === currentUserId;
    const isSelf = currentUserId === targetUserId;

    if (!isOwner && !isSelf) {
      return res
        .status(403)
        .json({ error: "Not authorized to remove this member" });
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

    // Remove member
    await prisma.taskListMember.delete({
      where: { id: member.id },
    });

    res.json({
      message: isSelf
        ? "Left TaskList successfully"
        : "Member removed successfully",
    });
  } catch (error) {
    console.error("Remove member error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
