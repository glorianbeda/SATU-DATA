const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");
const crypto = require("crypto");

const prisma = new PrismaClient();

/**
 * POST /api/archives/:id/share
 * Create a share link for an archive
 */
const handler = async (req, res) => {
  try {
    const userId = req.user.id;
    const archiveId = parseInt(req.params.id);
    const { permission = "VIEW", expiresInDays } = req.body;

    if (isNaN(archiveId)) {
      return res.status(400).json({ error: "Invalid archive ID" });
    }

    // Check archive exists and belongs to user
    const archive = await prisma.archive.findFirst({
      where: { id: archiveId, uploadedById: userId },
    });

    if (!archive) {
      return res.status(404).json({ error: "Arsip tidak ditemukan" });
    }

    // Generate unique token
    const shareToken = crypto.randomBytes(32).toString("hex");

    // Calculate expiry date if specified
    let expiresAt = null;
    if (expiresInDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresInDays));
    }

    const share = await prisma.archiveShare.create({
      data: {
        archiveId,
        shareToken,
        permission,
        expiresAt,
        createdById: userId,
      },
    });

    const shareUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/archives/shared/${shareToken}`;

    res.status(201).json({
      share,
      shareUrl,
    });
  } catch (error) {
    console.error("Create share error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
