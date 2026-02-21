const prisma = require("@/utils/prisma");
const authMiddleware = require("@/middleware/auth");
const { generateRandomCode, isValidUrl } = require("@/utils/shortCodeGenerator");

const handler = async (req, res) => {
  try {
    const { originalUrl, customCode, expiresAt } = req.body;

    if (!originalUrl || !isValidUrl(originalUrl)) {
      return res.status(400).json({ error: "Invalid original URL" });
    }

    let shortCode = generateRandomCode(8);

    if (customCode) {
      const existing = await prisma.shortLink.findFirst({
        where: {
          OR: [{ shortCode: customCode }, { customCode: customCode }],
        },
      });
      if (existing) {
        return res.status(400).json({ error: "Custom code already exists" });
      }
      shortCode = customCode;
    } else {
      let attempts = 0;
      while (attempts < 10) {
        const existing = await prisma.shortLink.findUnique({
          where: { shortCode },
        });
        if (!existing) break;
        shortCode = generateRandomCode(8);
        attempts++;
      }
      if (attempts >= 10) {
        return res.status(500).json({ error: "Failed to generate unique code" });
      }
    }

    const shortLink = await prisma.shortLink.create({
      data: {
        originalUrl,
        shortCode,
        customCode: customCode || null,
        userId: req.user.id,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    res.json({ shortLink });
  } catch (error) {
    console.error("Error creating short link:", error);
    res.status(500).json({ error: "Failed to create short link" });
  }
};

module.exports = [authMiddleware, handler];
