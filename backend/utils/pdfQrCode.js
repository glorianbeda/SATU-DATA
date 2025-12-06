const { PDFDocument, rgb } = require("pdf-lib");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

/**
 * Generate QR code as PNG buffer
 * @param {string} data - Data to encode in QR code
 * @returns {Promise<Buffer>} PNG image buffer
 */
async function generateQRCode(data) {
  const buffer = await QRCode.toBuffer(data, {
    errorCorrectionLevel: "H",
    type: "png",
    width: 120,
    margin: 1,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });
  return buffer;
}

/**
 * Embed QR code into the last page of a PDF
 * @param {string} pdfPath - Path to the original PDF
 * @param {string} qrData - Data for the QR code
 * @param {string} label - Label text below QR code
 * @returns {Promise<{outputPath: string, checksum: string}>} Path to modified PDF and its checksum
 */
async function embedQRCodeInPDF(pdfPath, qrData, label = "Scan to verify") {
  // Read the original PDF
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // Get last page
  const pages = pdfDoc.getPages();
  const lastPage = pages[pages.length - 1];
  const { width, height } = lastPage.getSize();

  // Generate QR code
  const qrBuffer = await generateQRCode(qrData);
  const qrImage = await pdfDoc.embedPng(qrBuffer);

  // QR code dimensions and position (bottom-right corner)
  const qrSize = 60;
  const margin = 30;
  const qrX = width - qrSize - margin;
  const qrY = margin;

  // Draw QR code
  lastPage.drawImage(qrImage, {
    x: qrX,
    y: qrY,
    width: qrSize,
    height: qrSize,
  });

  // Draw label below QR code
  const font = await pdfDoc.embedFont("Helvetica");
  const fontSize = 6;
  const textWidth = font.widthOfTextAtSize(label, fontSize);
  const textX = qrX + (qrSize - textWidth) / 2;
  const textY = qrY - 10;

  lastPage.drawText(label, {
    x: textX,
    y: textY,
    size: fontSize,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Save modified PDF
  const modifiedPdfBytes = await pdfDoc.save();

  // Generate output filename
  const originalName = path.basename(pdfPath, ".pdf");
  const timestamp = Date.now();
  const outputFilename = `${originalName}_signed_${timestamp}.pdf`;
  const outputDir = path.dirname(pdfPath);
  const outputPath = path.join(outputDir, outputFilename);

  // Write the modified PDF
  fs.writeFileSync(outputPath, modifiedPdfBytes);

  // Calculate checksum of new file
  const hashSum = crypto.createHash("sha256");
  hashSum.update(modifiedPdfBytes);
  const checksum = hashSum.digest("hex");

  return {
    outputPath,
    outputFilename,
    relativePath: `/uploads/documents/${outputFilename}`,
    checksum,
  };
}

/**
 * Check if all signature requests for a document are completed
 * @param {Object} prisma - Prisma client
 * @param {number} documentId - Document ID
 * @returns {Promise<boolean>}
 */
async function areAllSignaturesComplete(prisma, documentId) {
  const pendingCount = await prisma.signatureRequest.count({
    where: {
      documentId,
      status: "PENDING",
    },
  });
  return pendingCount === 0;
}

module.exports = {
  generateQRCode,
  embedQRCodeInPDF,
  areAllSignaturesComplete,
};
