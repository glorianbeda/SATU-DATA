const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { title, description, slug, schema, settings } = req.body;

    if (!title || !slug || !schema) {
      return res
        .status(400)
        .json({ error: "Title, slug, and schema are required" });
    }

    // Check slug uniqueness
    const existing = await prisma.form.findUnique({ where: { slug } });
    if (existing) {
      return res.status(400).json({ error: "Slug already exists" });
    }

    const form = await prisma.form.create({
      data: {
        title,
        description,
        slug,
        schema,
        settings: settings || {},
        createdById: userId,
      },
    });

    res.json(form);
  } catch (error) {
    console.error("Error creating form:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
