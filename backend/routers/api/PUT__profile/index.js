const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("../../../middleware/auth");

const prisma = new PrismaClient();

const upload = require("../../../middleware/upload");

// Middleware array: Auth -> Multer -> Handler
const handler = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    // Files are in req.files['profilePicture'] and req.files['sign']
    const profilePictureFile = req.files?.["profilePicture"]?.[0];
    const signFile = req.files?.["sign"]?.[0];

    console.log("Update Profile Request:", {
      userId,
      name,
      hasProfilePicture: !!profilePictureFile,
      hasSign: !!signFile,
    });

    const updateData = {};
    if (name) updateData.name = name;

    if (profilePictureFile) {
      // Store relative path or full URL. Storing relative path is better.
      // Assuming we serve uploads at /uploads
      updateData.profilePicture = `/uploads/${profilePictureFile.filename}`;
    }

    if (signFile) {
      updateData.sign = `/uploads/${signFile.filename}`;
    }

    const cache = require("../../../utils/cache");

    // ... (inside handler)

    const updatedAdmin = await prisma.admin.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        sign: true,
        role: { select: { name: true } },
      },
    });

    // Invalidate cache
    const cacheKey = `profile:${userId}`;
    await cache.del(cacheKey);

    res.json({
      message: "Profile updated successfully",
      user: updatedAdmin,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Export an array of middlewares to be used by the router loader
// However, the router loader in index.js expects a function (req, res).
// It doesn't seem to support array of middlewares directly unless we wrap it.
// Let's wrap it.

module.exports = [
  authMiddleware,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "sign", maxCount: 1 },
  ]),
  handler,
];
