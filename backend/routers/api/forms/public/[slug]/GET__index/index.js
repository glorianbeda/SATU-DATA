const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (req, res) => {
  try {
    const { slug } = req.params;

    const form = await prisma.form.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        schema: true,
        isActive: true,
        settings: true,
        // Do not expose createdById or other internal fields publicly
      },
    });

    if (!form) return res.status(404).json({ error: "Form not found" });
    if (!form.isActive)
      return res.status(404).json({ error: "Form is inactive" });

    res.json(form);
  } catch (error) {
    console.error("Error fetching public form:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
