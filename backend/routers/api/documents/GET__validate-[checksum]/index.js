const { PrismaClient } = require("@prisma/client");
const { verifySignature } = require("@/utils/documentCrypto");

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    const { checksum } = req.params;

    // Remove dashes from verification code format (e.g., "ABC1-2DEF" -> "ABC12DEF")
    const cleanCode = checksum.replace(/-/g, "").toUpperCase();

    let document;

    // Try exact match first (full checksum)
    document = await prisma.document.findUnique({
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
        hash: true, // Include DocumentHash
      },
    });

    // If not found and code is short, try prefix match
    if (!document && cleanCode.length <= 8) {
      document = await prisma.document.findFirst({
        where: {
          checksum: { startsWith: cleanCode.toLowerCase() },
        },
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
          hash: true, // Include DocumentHash
        },
      });
    }

    if (!document) {
      return res
        .status(404)
        .json({ valid: false, message: "Document not found" });
    }

    // Build hash info if available
    let hashInfo = null;
    if (document.hash) {
      const { originalHash, signedHash, signatureData, algorithm } =
        document.hash;

      // Verify HMAC signature if signedHash and signatureData exist
      let isSignatureValid = false;
      if (signedHash && signatureData) {
        isSignatureValid = verifySignature(signedHash, signatureData);
      }

      hashInfo = {
        originalHash,
        signedHash,
        algorithm,
        isSignatureValid,
        isSigned: !!signedHash,
      };
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
      hashInfo, // Include cryptographic hash info
    });
  } catch (error) {
    console.error("Validate document error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = handler;
