const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

/**
 * GET /api/archives/:id
 * Get single archive details
 */
const handler = async (req, res) => {
  try {
    const userId = req.user.id;
    const archiveId = parseInt(req.params.id);

    // Validate archiveId is a valid number
    if (isNaN(archiveId)) {
      return res.status(400).json({ error: "Invalid archive ID" });
    }

    const archive = await prisma.archive.findFirst({
      where: { id: archiveId, uploadedById: userId },
      include: {
        folder: { select: { id: true, name: true } },
        uploadedBy: { select: { id: true, name: true } },
        parentVersion: {
          select: { id: true, originalName: true, version: true },
        },
        childVersions: {
          select: {
            id: true,
            originalName: true,
            version: true,
            createdAt: true,
          },
          orderBy: { version: "desc" },
        },
        shares: {
          select: {
            id: true,
            shareToken: true,
            permission: true,
            expiresAt: true,
            createdAt: true,
          },
        },
      },
    });

    if (!archive) {
      return res.status(404).json({ error: "Arsip tidak ditemukan" });
    }

    res.json({ archive });
  } catch (error) {
    console.error("Get archive error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
