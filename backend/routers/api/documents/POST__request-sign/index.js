const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    const {
      documentId,
      signerId,
      x,
      y,
      page,
      type,
      text,
      width,
      height,
      fontSize,
    } = req.body;

    if (
      !documentId ||
      !signerId ||
      x === undefined ||
      y === undefined ||
      !page
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Verify document exists
    const document = await prisma.document.findUnique({
      where: { id: parseInt(documentId) },
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Verify signer exists
    const signer = await prisma.user.findUnique({
      where: { id: parseInt(signerId) },
    });

    if (!signer) {
      return res.status(404).json({ error: "Signer not found" });
    }

    const request = await prisma.signatureRequest.create({
      data: {
        documentId: document.id,
        signerId: signer.id,
        x: x,
        y: y,
        page: page,
        isSigned: false,
        status: "PENDING",
        type: type || "signature",
        text: text,
        width: width,
        height: height,
        fontSize: fontSize,
      },
    });

    res.status(201).json({
      message: "Signature request created",
      request,
    });
  } catch (error) {
    console.error("Request sign error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
