const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { id } = req.params;
    const { title, description, slug, schema, isActive, settings } = req.body;

    const form = await prisma.form.findUnique({ where: { id } });
    if (!form) return res.status(404).json({ error: "Form not found" });
    if (form.createdById !== userId)
      return res.status(403).json({ error: "Forbidden" });

    // Check slug uniqueness if changed
    if (slug && slug !== form.slug) {
      const existing = await prisma.form.findUnique({ where: { slug } });
      if (existing) {
        return res.status(400).json({ error: "Slug already exists" });
      }
    }

    const updatedForm = await prisma.form.update({
      where: { id },
      data: {
        title,
        description,
        slug,
        schema,
        isActive,
        settings,
      },
    });

    res.json(updatedForm);
  } catch (error) {
    console.error("Error updating form:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
