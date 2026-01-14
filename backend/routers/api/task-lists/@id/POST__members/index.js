const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

/**
 * POST /api/task-lists/:id/members
 * Invite a member to TaskList (owner only)
 */
const handler = async (req, res) => {
  try {
    const userId = req.user.id;
    const listId = parseInt(req.params.id);
    const { email, permission = "EDITOR" } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check ownership
    const taskList = await prisma.taskList.findUnique({
      where: { id: listId },
    });

    if (!taskList) {
      return res.status(404).json({ error: "TaskList not found" });
    }

    if (taskList.ownerId !== userId) {
      return res.status(403).json({ error: "Only owner can invite members" });
    }

    // Find user to invite
    const invitee = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });

    if (!invitee) {
      return res.status(404).json({ error: "User not found" });
    }

    if (invitee.id === userId) {
      return res.status(400).json({ error: "Cannot invite yourself" });
    }

    // Check if already a member
    const existingMember = await prisma.taskListMember.findUnique({
      where: { taskListId_userId: { taskListId: listId, userId: invitee.id } },
    });

    if (existingMember) {
      return res.status(400).json({ error: "User is already a member" });
    }

    // Add member
    await prisma.taskListMember.create({
      data: {
        taskListId: listId,
        userId: invitee.id,
        permission: ["VIEWER", "EDITOR"].includes(permission)
          ? permission
          : "EDITOR",
      },
    });

    res.status(201).json({
      message: "Member invited successfully",
      member: {
        userId: invitee.id,
        name: invitee.name,
        email: invitee.email,
        permission,
      },
    });
  } catch (error) {
    console.error("Invite member error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
