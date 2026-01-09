const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    const user = req.user;
    const documentId = parseInt(req.params.id);

    if (isNaN(documentId)) {
      return res.status(400).json({ error: "Invalid document ID" });
    }

    // Check if user is SUPER_ADMIN or ADMIN
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { role: true },
    });

    if (!dbUser || !["SUPER_ADMIN", "ADMIN"].includes(dbUser.role.name)) {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }

    // Check if document exists
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Soft delete the document
    const updatedDocument = await prisma.document.update({
      where: { id: documentId },
      data: {
        deletedAt: new Date(),
        deletedById: user.id,
      },
    });

    res.json({
      message: "Document deleted successfully",
      document: {
        id: updatedDocument.id,
        title: updatedDocument.title,
        deletedAt: updatedDocument.deletedAt,
      },
    });
  } catch (error) {
    console.error("Delete document error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
