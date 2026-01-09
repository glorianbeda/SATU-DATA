const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

/**
 * Generate short verification code from checksum
 * @param {string} checksum - Full checksum
 * @returns {string} Short code like "ABC1-2DEF"
 */
function generateVerificationCode(checksum) {
  const clean = checksum.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return `${clean.slice(0, 4)}-${clean.slice(4, 8)}`;
}

/**
 * Embed verification metadata in PDF without visible changes
 * Uses PDF document properties (Title, Subject, Keywords) to store verification info
 * @param {string} pdfPath - Path to the original PDF
 * @param {string} verificationUrl - URL for verification
 * @param {string} verificationCode - Short verification code
 * @returns {Promise<{outputPath: string, checksum: string, verificationCode: string}>}
 */
async function embedVerificationMetadata(
  pdfPath,
  verificationUrl,
  verificationCode = null
) {
  // Read the original PDF
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // Get original title or use filename
  const originalTitle = pdfDoc.getTitle() || path.basename(pdfPath, ".pdf");

  // Set PDF metadata with verification info (invisible to document content)
  pdfDoc.setSubject(
    `Verified Document | Code: ${verificationCode || "PENDING"}`
  );
  pdfDoc.setKeywords([
    "satu-data-verified",
    `code:${verificationCode || ""}`,
    `url:${verificationUrl}`,
  ]);
  pdfDoc.setProducer("Satu Data+ Document Verification System");
  pdfDoc.setCreator("OMK-Docs");

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
    verificationCode: verificationCode || generateVerificationCode(checksum),
  };
}

/**
 * Legacy function - kept for backward compatibility but now just calls embedVerificationMetadata
 * @deprecated Use embedVerificationMetadata instead
 */
async function embedQRCodeInPDF(pdfPath, qrData, verificationCode = null) {
  return embedVerificationMetadata(pdfPath, qrData, verificationCode);
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
  embedQRCodeInPDF,
  embedVerificationMetadata,
  areAllSignaturesComplete,
  generateVerificationCode,
};
