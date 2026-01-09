const multer = require("multer");
const path = require("path");
const fs = require("fs");
const authMiddleware = require("@/middleware/auth");

// Ensure directory exists
const uploadDir = path.join(process.cwd(), "uploads/images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

const handler = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  // URL path matching index.js static serve
  const url = `/uploads/images/${req.file.filename}`;
  res.json({ url });
};

// Middleware chain: Auth -> Multer -> Handler
module.exports = [authMiddleware, upload.single("image"), handler];
