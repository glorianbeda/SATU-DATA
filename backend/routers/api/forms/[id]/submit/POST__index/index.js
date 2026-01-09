const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  try {
    const { id } = req.params; // This parameter comes from the folder name [id], but effectively handles the slug due to route structure?
    // Wait, if I put this in `[id]/submit/POST__index`, the route is `/api/forms/:id/submit`.
    // The proposal said `POST /api/forms/:slug/submit`.
    // If I want `:slug` I should check if `id` is a slug or uuid.
    // Or I should rely on front-end passing the UUID (formId) or Slug.
    // The implementation of public form fetch uses slug.
    // So usually submission URL also uses slug.
    // If I use `[id]` folder, `req.params.id` will capture the slug.
    // So I can use `req.params.id` as the slug.

    const slug = id;
    const { data, guestName } = req.body;

    const form = await prisma.form.findUnique({ where: { slug } });
    if (!form) return res.status(404).json({ error: "Form not found" });
    if (!form.isActive)
      return res.status(400).json({ error: "Form is inactive" });

    // Handle Auth
    let userId = null;
    const token = req.cookies.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (e) {
        // Token invalid, treat as guest? Or fail?
        // If guestName provided, maybe treat as guest.
        // But better to just ignore invalid token.
      }
    }

    if (!userId && !guestName) {
      return res.status(400).json({ error: "Name is required for guests" });
    }

    // Check limits (Implementation of Requirement: System enforces submission limits)
    // 1. One response per user
    if (form.settings?.limitOneResponsePerUser && userId) {
      const existing = await prisma.formResponse.findFirst({
        where: { formId: form.id, userId },
      });
      if (existing) {
        return res
          .status(400)
          .json({ error: "You have already submitted this form" });
      }
    }

    // 2. One response per device (IP check? Or cookie?)
    // Using IP for now as per design "ipAddress: String?".
    if (form.settings?.limitOneResponsePerDevice) {
      // Only strict if we trust IP.
      // For simple check:
      const ip = req.ip || req.connection.remoteAddress;
      const existing = await prisma.formResponse.findFirst({
        where: { formId: form.id, ipAddress: ip },
      });
      if (existing) {
        return res
          .status(400)
          .json({ error: "This device has already submitted a response" });
      }
    }

    await prisma.formResponse.create({
      data: {
        formId: form.id,
        userId: userId || null,
        guestName: userId ? null : guestName,
        data,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers["user-agent"],
      },
    });

    res.json({ message: "Submitted successfully" });
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
