const { PrismaClient } = require("@prisma/client");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const authMiddleware = require("@/middleware/auth");
const {
  embedQRCodeInPDF,
  areAllSignaturesComplete,
} = require("@/utils/pdfQrCode");

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    const { requestId } = req.body;
    const signerId = req.user.id;

    if (!requestId) {
      return res.status(400).json({ error: "Request ID is required" });
    }

    // Fetch request with document and signer
    const request = await prisma.signatureRequest.findUnique({
      where: { id: parseInt(requestId) },
      include: {
        document: true,
        signer: true,
      },
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (request.signerId !== signerId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (request.status !== "PENDING") {
      return res.status(400).json({ error: "Request already processed" });
    }

    const isSignature =
      !request.type ||
      request.type === "signature" ||
      request.type === "initial";

    if (isSignature && !request.signer.sign) {
      return res.status(400).json({ error: "User has no signature set" });
    }

    // Paths
    const backendRoot = path.join(__dirname, "../../../../");

    const resolvePath = (relativePath) => {
      const cleanPath = relativePath.startsWith("/")
        ? relativePath.slice(1)
        : relativePath;
      return path.join(backendRoot, cleanPath);
    };

    const pdfPath = resolvePath(request.document.filePath);
    const signPath = isSignature ? resolvePath(request.signer.sign) : null;

    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ error: "PDF file not found on server" });
    }
    if (isSignature && !fs.existsSync(signPath)) {
      return res
        .status(404)
        .json({ error: "Signature file not found on server" });
    }

    // Load PDF
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Get page
    const pages = pdfDoc.getPages();
    const pageIndex = request.page - 1;
    if (pageIndex < 0 || pageIndex >= pages.length) {
      return res.status(400).json({ error: "Invalid page number" });
    }
    const page = pages[pageIndex];

    const { width, height } = page.getSize();
    let drawX = request.x;
    let drawY = request.y;

    if (request.x <= 1 && request.y <= 1) {
      drawX = request.x * width;
      drawY = height - request.y * height;
    } else {
      drawY = height - request.y;
    }

    if (request.type === "text" || request.type === "date") {
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      let fontSize = 12;

      if (request.height && request.height <= 1) {
        fontSize = request.height * height * 0.6;
      }

      const text =
        request.type === "date"
          ? new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : request.text || "Signed";

      page.drawText(text, {
        x: drawX,
        y: drawY - fontSize,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
    } else {
      const signBytes = fs.readFileSync(signPath);
      let signImage;
      if (signPath.endsWith(".png")) {
        signImage = await pdfDoc.embedPng(signBytes);
      } else {
        signImage = await pdfDoc.embedJpg(signBytes);
      }

      let targetWidth = 100;
      if (request.width && request.width <= 1) {
        targetWidth = request.width * width;
      }

      const scaleFactor = targetWidth / signImage.width;
      const finalDims = signImage.scale(scaleFactor);

      drawY = drawY - finalDims.height;

      page.drawImage(signImage, {
        x: drawX,
        y: drawY,
        width: finalDims.width,
        height: finalDims.height,
      });
    }

    // Save PDF
    const modifiedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(pdfPath, modifiedPdfBytes);

    // Update request status
    const updatedRequest = await prisma.signatureRequest.update({
      where: { id: parseInt(requestId) },
      data: {
        status: "SIGNED",
        isSigned: true,
        signedAt: new Date(),
      },
    });

    // Check if all signatures are complete for this document
    const allComplete = await areAllSignaturesComplete(
      prisma,
      request.documentId
    );

    if (allComplete) {
      // Embed QR code for validation
      const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      const validationUrl = `${baseUrl}/docs/validate?id=${
        request.documentId
      }&checksum=${request.document.checksum.substring(0, 8)}`;

      try {
        const qrResult = await embedQRCodeInPDF(
          pdfPath,
          validationUrl,
          "Scan to verify authenticity"
        );

        // Update document with new checksum and file path
        await prisma.document.update({
          where: { id: request.documentId },
          data: {
            checksum: qrResult.checksum,
            filePath: qrResult.relativePath,
          },
        });

        console.log(`QR code embedded. New checksum: ${qrResult.checksum}`);
      } catch (qrError) {
        console.error("Failed to embed QR code:", qrError);
        // Don't fail the signing, just log the error
      }
    }

    res.json({
      message: "Document signed successfully",
      request: updatedRequest,
      allSignaturesComplete: allComplete,
    });
  } catch (error) {
    console.error("Sign document error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
