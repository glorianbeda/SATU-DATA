const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get requests where user is signer OR uploader
    // Use distinct to prevent duplicates when user is both
    const requests = await prisma.signatureRequest.findMany({
      where: {
        OR: [{ signerId: userId }, { document: { uploaderId: userId } }],
      },
      distinct: ["id"],
      include: {
        document: {
          select: {
            id: true,
            title: true,
            filePath: true,
            deletedAt: true,
            deletedById: true,
            uploader: { select: { name: true, email: true } },
          },
        },
        signer: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ requests });
  } catch (error) {
    console.error("Get requests error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
