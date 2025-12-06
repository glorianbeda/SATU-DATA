const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    const { checksum } = req.params;

    const document = await prisma.document.findUnique({
      where: { checksum },
      include: {
        uploader: {
          select: { name: true, email: true },
        },
        requests: {
          where: { status: "SIGNED" },
          include: {
            signer: { select: { name: true, email: true } },
          },
        },
      },
    });

    if (!document) {
      return res
        .status(404)
        .json({ valid: false, message: "Document not found" });
    }

    res.json({
      valid: true,
      document: {
        title: document.title,
        uploadedBy: document.uploader,
        uploadedAt: document.createdAt,
        signatures: document.requests.map((req) => ({
          signer: req.signer,
          signedAt: req.signedAt,
        })),
      },
    });
  } catch (error) {
    console.error("Validate document error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = handler;
