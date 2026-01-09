const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    const user = req.user;

    // Check if user is SUPER_ADMIN or ADMIN
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { role: true },
    });

    if (!dbUser || !["SUPER_ADMIN", "ADMIN"].includes(dbUser.role.name)) {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }

    // Get all documents with their request counts
    const documents = await prisma.document.findMany({
      include: {
        uploader: { select: { id: true, name: true, email: true } },
        requests: {
          select: {
            id: true,
            status: true,
            isSigned: true,
            signer: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Format response with summary info
    const formattedDocuments = documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      filePath: doc.filePath,
      checksum: doc.checksum,
      uploader: doc.uploader,
      isDeleted: !!doc.deletedAt,
      deletedAt: doc.deletedAt,
      deletedById: doc.deletedById,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      requestCount: doc.requests.length,
      signedCount: doc.requests.filter((r) => r.isSigned).length,
      pendingCount: doc.requests.filter((r) => r.status === "PENDING").length,
    }));

    res.json({ documents: formattedDocuments });
  } catch (error) {
    console.error("Admin documents error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
