const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const prisma = new PrismaClient();

/**
 * GET /api/archives/share/:token
 * Access shared file via token (public endpoint)
 */
const handler = async (req, res) => {
  try {
    const { token } = req.params;
    const { download } = req.query;

    const share = await prisma.archiveShare.findUnique({
      where: { shareToken: token },
      include: {
        archive: {
          include: {
            uploadedBy: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!share) {
      return res
        .status(404)
        .json({ error: "Link tidak valid atau sudah dihapus" });
    }

    // Check if expired
    if (share.expiresAt && new Date() > share.expiresAt) {
      return res.status(410).json({ error: "Link sudah kadaluarsa" });
    }

    const archive = share.archive;

    // If download requested
    if (download === "true") {
      if (!fs.existsSync(archive.filePath)) {
        return res
          .status(404)
          .json({ error: "File tidak ditemukan di server" });
      }

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(archive.originalName)}"`
      );
      res.setHeader("Content-Type", archive.mimeType);
      res.setHeader("Content-Length", archive.fileSize);

      const fileStream = fs.createReadStream(archive.filePath);
      return fileStream.pipe(res);
    }

    // Return file info
    res.json({
      archive: {
        id: archive.id,
        originalName: archive.originalName,
        fileSize: archive.fileSize,
        mimeType: archive.mimeType,
        category: archive.category,
        createdAt: archive.createdAt,
        uploadedBy: archive.uploadedBy,
      },
      permission: share.permission,
      expiresAt: share.expiresAt,
    });
  } catch (error) {
    console.error("Access shared archive error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = handler;
