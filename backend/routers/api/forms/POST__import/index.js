const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { isAuthenticated } = require("@/middleware/auth");

module.exports = async (req, res) => {
  // Environment check: Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return res
      .status(403)
      .json({ error: "Import is only available in development environment" });
  }

  // Use auth middleware manually if not applied globally, or assume global auth middleware handles user population
  // If this route is unprotected by default, we should run auth check.
  // Based on other routes, we might need to check req.user.

  try {
    const { title, description, slug, schema, settings } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    // Auto-generate slug if missing
    let finalSlug = slug;
    if (!finalSlug) {
      finalSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      // Append random string to ensure uniqueness if needed, or let database constraint fail
      finalSlug = `${finalSlug}-${Math.random().toString(36).substring(2, 8)}`;
    }

    const form = await prisma.form.create({
      data: {
        title,
        description,
        slug: finalSlug,
        schema: schema || [],
        settings: settings || {},
        createdById: req.user ? req.user.id : 1, // Use createdById to match schema
      },
    });

    res.status(201).json(form);
  } catch (error) {
    console.error("Import error:", error);
    res.status(500).json({ error: "Failed to import form" });
  }
};
