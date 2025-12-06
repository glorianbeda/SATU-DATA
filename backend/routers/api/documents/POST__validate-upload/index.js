const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");
const fs = require("fs");
const uploadPdf = require("@/middleware/uploadPdf");

const prisma = new PrismaClient();

/**
 * POST /api/documents/validate-upload
 * Validates a document by uploading the file and comparing checksum
 */
const handler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;

    // Calculate checksum of uploaded file
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash("sha256");
    hashSum.update(fileBuffer);
    const checksum = hashSum.digest("hex");

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Find document with matching checksum
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
      return res.json({
        valid: false,
        message: "Document not found or has been modified",
        checksum,
      });
    }

    res.json({
      valid: true,
      document: {
        id: document.id,
        title: document.title,
        uploadedBy: document.uploader,
        uploadedAt: document.createdAt,
        checksum: document.checksum,
        signatures: document.requests.map((req) => ({
          signer: req.signer,
          signedAt: req.signedAt,
          isSigned: req.isSigned,
          status: req.status,
        })),
      },
    });
  } catch (error) {
    console.error("Validate document upload error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// No auth required for validation - anyone can verify a document
module.exports = [uploadPdf.single("document"), handler];
