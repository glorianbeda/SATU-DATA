const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");
const uploadArchive = require("@/middleware/uploadArchive");

const prisma = new PrismaClient();
const MAX_FILE_SIZE = 150 * 1024 * 1024; // 150MB

/**
 * POST /api/archives
 * Upload a new file
 */
const handler = async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;
    const { category = "Lainnya", parentVersionId } = req.body;

    if (!file) {
      return res.status(400).json({ error: "File wajib diunggah" });
    }

    // Check if file is PDF and exceeds limit (for redirect suggestion)
    const isPdf = file.mimetype === "application/pdf";
    const exceedsLimit = file.size > MAX_FILE_SIZE;

    if (exceedsLimit) {
      // Clean up uploaded file
      const fs = require("fs");
      fs.unlinkSync(file.path);

      if (isPdf) {
        return res.status(413).json({
          error: "File melebihi batas 150MB",
          isPdf: true,
          suggestCompress: true,
          message: "File PDF terlalu besar. Silakan kompres terlebih dahulu.",
          redirectUrl: "/tools/pdf/compress",
        });
      } else {
        return res.status(413).json({
          error: "File melebihi batas 150MB",
          isPdf: false,
          message: "Ukuran file maksimal adalah 150MB",
        });
      }
    }

    // Determine version number if this is a new version
    let version = 1;
    if (parentVersionId) {
      const parentVersion = await prisma.archive.findUnique({
        where: { id: parseInt(parentVersionId) },
      });
      if (parentVersion) {
        version = parentVersion.version + 1;
      }
    }

    const archive = await prisma.archive.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        filePath: file.path,
        fileSize: file.size,
        mimeType: file.mimetype,
        category,

        uploadedById: userId,
        version,
        parentVersionId: parentVersionId ? parseInt(parentVersionId) : null,
      },
      include: {
        uploadedBy: { select: { id: true, name: true } },
      },
    });

    res.status(201).json({ archive });
  } catch (error) {
    console.error("Upload archive error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, uploadArchive.single("file"), handler];
