const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");
const fs = require("fs");

const prisma = new PrismaClient();

/**
 * DELETE /api/archives/:id
 * Delete an archive and its file
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

    // Delete physical file if exists
    if (fs.existsSync(archive.filePath)) {
      fs.unlinkSync(archive.filePath);
    }

    // Delete from database
    await prisma.archive.delete({
      where: { id: archiveId },
    });

    res.json({ message: "Arsip berhasil dihapus" });
  } catch (error) {
    console.error("Delete archive error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
