const { PrismaClient } = require("@prisma/client");
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const path = require("path");
const authMiddleware = require("@/middleware/auth");

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

    if (!request.signer.sign) {
      return res.status(400).json({ error: "User has no signature set" });
    }

    // Paths
    // Assuming backend runs in /backend, and uploads are in /backend/uploads
    // request.document.filePath is like "/uploads/documents/..."
    // request.signer.sign is like "/uploads/..."

    // We need to resolve these to absolute paths
    const backendRoot = path.join(__dirname, "../../../../"); // routers/api/documents/POST__sign -> backend/
    // Actually, let's be safer. __dirname is .../backend/routers/api/documents/POST__sign
    // We want .../backend

    const resolvePath = (relativePath) => {
      // Remove leading slash if present to join correctly
      const cleanPath = relativePath.startsWith("/")
        ? relativePath.slice(1)
        : relativePath;
      return path.join(backendRoot, cleanPath);
    };

    const pdfPath = resolvePath(request.document.filePath);
    const signPath = resolvePath(request.signer.sign);

    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ error: "PDF file not found on server" });
    }
    if (!fs.existsSync(signPath)) {
      return res
        .status(404)
        .json({ error: "Signature file not found on server" });
    }

    // Load PDF
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Load Signature Image
    const signBytes = fs.readFileSync(signPath);
    let signImage;
    if (signPath.endsWith(".png")) {
      signImage = await pdfDoc.embedPng(signBytes);
    } else {
      signImage = await pdfDoc.embedJpg(signBytes);
    }

    // Get page
    const pages = pdfDoc.getPages();
    const pageIndex = request.page - 1; // 1-based to 0-based
    if (pageIndex < 0 || pageIndex >= pages.length) {
      return res.status(400).json({ error: "Invalid page number" });
    }
    const page = pages[pageIndex];

    // Draw signature
    // Coordinates: request.x, request.y are likely top-left based percentages or pixels?
    // Let's assume they are absolute points from bottom-left for now as per PDF standard,
    // OR we might need to flip Y if frontend sends top-left.
    // Usually frontend (web) is top-left. PDF is bottom-left.
    // Let's assume frontend sends {x, y} as % of page width/height to be resolution independent.
    // If x,y are > 1, assume pixels. If <= 1, assume percentage.

    const { width, height } = page.getSize();
    let drawX = request.x;
    let drawY = request.y;

    // Simple heuristic for percentage vs points
    if (request.x <= 1 && request.y <= 1) {
      drawX = request.x * width;
      // Flip Y for PDF (0 is bottom)
      // Frontend Y=0 is top. PDF Y=height is top.
      // So PDF_Y = height - (Frontend_Y * height)
      drawY = height - request.y * height;
    } else {
      // If pixels, still might need to flip Y if it came from web
      // Assuming web coordinates (top-left)
      drawY = height - request.y;
    }

    // Scale signature
    const signDims = signImage.scale(0.5); // Default scale?
    // Maybe we should allow scaling in request? For now fixed or based on box?
    // Let's use a standard width, say 100 units
    const targetWidth = 100;
    const scaleFactor = targetWidth / signImage.width;
    const finalDims = signImage.scale(scaleFactor);

    // Adjust drawY to be bottom-left of the image
    // If drawY was the top-left of the box
    drawY = drawY - finalDims.height;

    page.drawImage(signImage, {
      x: drawX,
      y: drawY,
      width: finalDims.width,
      height: finalDims.height,
    });

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

    res.json({
      message: "Document signed successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Sign document error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
