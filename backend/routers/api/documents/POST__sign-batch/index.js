const { PrismaClient } = require("@prisma/client");
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const path = require("path");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    const { documentId, requestIds } = req.body;
    const signerId = req.user.id;

    if (
      !documentId ||
      !requestIds ||
      !Array.isArray(requestIds) ||
      requestIds.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Missing documentId or requestIds" });
    }

    // 1. Fetch Document
    const document = await prisma.document.findUnique({
      where: { id: parseInt(documentId) },
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // 2. Fetch all requests to verify ownership and status
    const requests = await prisma.signatureRequest.findMany({
      where: {
        id: { in: requestIds.map((id) => parseInt(id)) },
        documentId: parseInt(documentId),
        signerId: signerId,
        status: "PENDING",
      },
    });

    if (requests.length !== requestIds.length) {
      return res
        .status(400)
        .json({ error: "Some requests are invalid or already processed" });
    }

    // 3. Load PDF
    const pdfPath = path.join(
      __dirname,
      "../../../../../uploads/documents",
      path.basename(document.filePath)
    );
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ error: "PDF file not found" });
    }

    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    // 4. Fetch Signer's Signature Image
    const signer = await prisma.user.findUnique({
      where: { id: signerId },
    });

    if (!signer.sign) {
      return res
        .status(400)
        .json({ error: "User does not have a signature configured" });
    }

    // Load signature image (assuming base64 or path, let's assume path for now based on previous implementation or base64 data url)
    // Previous implementation used `signer.sign` which seemed to be a path.
    // Let's check how `POST__sign` does it.
    // It assumes `signer.sign` is a path relative to API URL, but stored in DB as path.
    // Actually, let's assume it's a path on disk.

    let signatureImage;
    const signPath = path.join(
      __dirname,
      "../../../../../",
      signer.sign.replace("/uploads", "uploads")
    ); // Adjust path logic as needed

    if (fs.existsSync(signPath)) {
      const signBytes = fs.readFileSync(signPath);
      if (signer.sign.endsWith(".png")) {
        signatureImage = await pdfDoc.embedPng(signBytes);
      } else {
        signatureImage = await pdfDoc.embedJpg(signBytes);
      }
    } else {
      return res.status(400).json({ error: "Signature image file not found" });
    }

    // 5. Apply all signatures
    for (const request of requests) {
      const page = pages[request.page - 1];
      const { width, height } = page.getSize();

      // Convert normalized coordinates back to PDF coordinates
      // x, y are 0-1.
      // PDF coords: (0,0) is bottom-left.
      // Frontend usually sends top-left based coords.
      // Let's assume x, y are top-left normalized.

      const pdfX = request.x * width;
      const pdfY = height - request.y * height; // Flip Y because PDF is bottom-left origin

      // Scale signature (fixed for now, or use request width/height if we stored it)
      const signDims = signatureImage.scale(0.5); // Fixed scale for now

      page.drawImage(signatureImage, {
        x: pdfX,
        y: pdfY - signDims.height, // Adjust for top-left anchor
        width: signDims.width,
        height: signDims.height,
      });

      // Update request status
      await prisma.signatureRequest.update({
        where: { id: request.id },
        data: {
          status: "SIGNED",
          isSigned: true,
          signedAt: new Date(),
        },
      });
    }

    // 6. Save PDF
    const modifiedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(pdfPath, modifiedPdfBytes);

    res.json({ message: "All requests signed successfully" });
  } catch (error) {
    console.error("Batch sign error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
