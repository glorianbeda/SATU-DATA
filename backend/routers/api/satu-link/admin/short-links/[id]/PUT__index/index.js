const prisma = require("@/utils/prisma");
const authMiddleware = require("@/middleware/auth");
const { isValidUrl } = require("@/utils/shortCodeGenerator");

const handler = async (req, res) => {
  try {
    const { id } = req.params;
    const { originalUrl, customCode, expiresAt, isActive } = req.body;

    const existing = await prisma.shortLink.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Short link not found" });
    }

    if (customCode && customCode !== existing.customCode) {
      const codeExists = await prisma.shortLink.findFirst({
        where: {
          OR: [{ shortCode: customCode }, { customCode: customCode }],
          NOT: { id },
        },
      });
      if (codeExists) {
        return res.status(400).json({ error: "Custom code already exists" });
      }
    }

    if (originalUrl && !isValidUrl(originalUrl)) {
      return res.status(400).json({ error: "Invalid original URL" });
    }

    const shortLink = await prisma.shortLink.update({
      where: { id },
      data: {
        ...(originalUrl && { originalUrl }),
        ...(customCode !== undefined && { 
          customCode: customCode || null,
          shortCode: customCode || existing.shortCode,
        }),
        ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({ shortLink });
  } catch (error) {
    console.error("Error updating short link:", error);
    res.status(500).json({ error: "Failed to update short link" });
  }
};

module.exports = [authMiddleware, handler];
