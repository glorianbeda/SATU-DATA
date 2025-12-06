const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");
const fs = require("fs");
const uploadPdf = require("@/middleware/uploadPdf");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { title } = req.body;
    const filePath = req.file.path;
    const relativePath = `/uploads/documents/${req.file.filename}`;

    // Calculate checksum
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash("sha256");
    hashSum.update(fileBuffer);
    const checksum = hashSum.digest("hex");

    // Check if document with same checksum exists
    const existingDoc = await prisma.document.findUnique({
      where: { checksum },
    });

    if (existingDoc) {
      // Optional: Delete the uploaded file since it's a duplicate
      fs.unlinkSync(filePath);
      return res.status(409).json({
        error: "Document already exists",
        document: existingDoc,
      });
    }

    const document = await prisma.document.create({
      data: {
        title: title || req.file.originalname,
        filePath: relativePath,
        checksum,
        uploaderId: req.user.id,
      },
    });

    res.status(201).json({
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    console.error("Upload document error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, uploadPdf.single("document"), handler];
