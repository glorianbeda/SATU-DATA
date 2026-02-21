const prisma = require("@/utils/prisma");

const handler = async (req, res) => {
  try {
    const { code } = req.params;

    const shortLink = await prisma.shortLink.findFirst({
      where: {
        OR: [{ shortCode: code }, { customCode: code }],
      },
    });

    if (!shortLink) {
      return res.status(404).json({ error: "Link not found" });
    }

    if (!shortLink.isActive) {
      return res.status(410).json({ error: "Link is inactive" });
    }

    if (shortLink.expiresAt && new Date() > shortLink.expiresAt) {
      return res.status(410).json({ error: "Link has expired" });
    }

    await prisma.shortLink.update({
      where: { id: shortLink.id },
      data: { clicks: { increment: 1 } },
    });

    res.redirect(shortLink.originalUrl);
  } catch (error) {
    console.error("Error redirecting short link:", error);
    res.status(500).json({ error: "Failed to redirect" });
  }
};

module.exports = handler;
