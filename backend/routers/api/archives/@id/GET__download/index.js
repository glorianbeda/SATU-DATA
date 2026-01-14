const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");
const path = require("path");
const fs = require("fs");

const prisma = new PrismaClient();

/**
 * GET /api/archives/:id/download
 * Download a file
 */
const handler = async (req, res) => {
  try {
    const userId = req.user.id;
    const archiveId = parseInt(req.params.id);

    if (isNaN(archiveId)) {
      return res.status(400).json({ error: "Invalid archive ID" });
    }

    const archive = await prisma.archive.findFirst({
      where: { id: archiveId, uploadedById: userId },
    });

    if (!archive) {
      return res.status(404).json({ error: "Arsip tidak ditemukan" });
    }

    // Check file exists
    if (!fs.existsSync(archive.filePath)) {
      return res.status(404).json({ error: "File tidak ditemukan di server" });
    }

    // Set headers for download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(archive.originalName)}"`
    );
    res.setHeader("Content-Type", archive.mimeType);
    res.setHeader("Content-Length", archive.fileSize);

    // Stream file
    const fileStream = fs.createReadStream(archive.filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Download archive error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
