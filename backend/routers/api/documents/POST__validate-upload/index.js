const { PrismaClient } = require("@prisma/client");
const { generateHash, verifySignature } = require("@/utils/documentCrypto");
const fs = require("fs");
const uploadPdf = require("@/middleware/uploadPdf");

const prisma = new PrismaClient();

/**
 * POST /api/documents/validate-upload
 * Accept file upload, compute hash, verify against DocumentHash table
 */
const handler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);

    // Calculate SHA-256 hash of uploaded file
    const uploadedHash = generateHash(fileBuffer);

    // Clean up uploaded file immediately after hashing
    fs.unlinkSync(filePath);

    // Search for matching hash in DocumentHash table
    // Try signedHash first (final signed document)
    let documentHash = await prisma.documentHash.findFirst({
      where: { signedHash: uploadedHash },
      include: {
        document: {
          include: {
            uploader: { select: { name: true, email: true } },
            requests: {
              where: { status: "SIGNED" },
              include: {
                signer: { select: { name: true, email: true } },
              },
            },
          },
        },
      },
    });

    let matchType = "signed";

    // If not found, try originalHash (document before signing)
    if (!documentHash) {
      documentHash = await prisma.documentHash.findFirst({
        where: { originalHash: uploadedHash },
        include: {
          document: {
            include: {
              uploader: { select: { name: true, email: true } },
              requests: {
                where: { status: "SIGNED" },
                include: {
                  signer: { select: { name: true, email: true } },
                },
              },
            },
          },
        },
      });
      matchType = "original";
    }

    // Fallback: try Document.checksum for backward compatibility
    if (!documentHash) {
      const document = await prisma.document.findUnique({
        where: { checksum: uploadedHash },
        include: {
          uploader: { select: { name: true, email: true } },
          requests: {
            where: { status: "SIGNED" },
            include: {
              signer: { select: { name: true, email: true } },
            },
          },
        },
      });

      if (document) {
        return res.json({
          valid: true,
          matchType: "checksum",
          document: {
            id: document.id,
            title: document.title,
            uploadedBy: document.uploader,
            uploadedAt: document.createdAt,
            signatures: document.requests.map((req) => ({
              signer: req.signer,
              signedAt: req.signedAt,
            })),
          },
          hashInfo: null, // No DocumentHash record found
        });
      }
    }

    if (!documentHash) {
      return res.status(404).json({
        valid: false,
        message: "Document not found or has been modified",
        uploadedHash: uploadedHash.substring(0, 16) + "...",
      });
    }

    const { document } = documentHash;

    // Verify HMAC signature if available
    let isSignatureValid = false;
    if (documentHash.signedHash && documentHash.signatureData) {
      isSignatureValid = verifySignature(
        documentHash.signedHash,
        documentHash.signatureData
      );
    }

    res.json({
      valid: true,
      matchType, // 'signed' or 'original'
      document: {
        id: document.id,
        title: document.title,
        uploadedBy: document.uploader,
        uploadedAt: document.createdAt,
        signatures: document.requests.map((req) => ({
          signer: req.signer,
          signedAt: req.signedAt,
        })),
      },
      hashInfo: {
        originalHash: documentHash.originalHash,
        signedHash: documentHash.signedHash,
        algorithm: documentHash.algorithm,
        isSignatureValid,
        isSigned: !!documentHash.signedHash,
        matchedHash: uploadedHash,
      },
    });
  } catch (error) {
    console.error("Validate upload error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// No auth required for validation - anyone can verify a document
module.exports = [uploadPdf.single("document"), handler];
