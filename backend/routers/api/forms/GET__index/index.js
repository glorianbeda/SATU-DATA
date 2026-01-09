const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Get forms created by user
    const forms = await prisma.form.findMany({
      where: { createdById: userId, isActive: true }, // Only active forms usually? Or all? Dashboard implies all.
      // Soft delete logic usually means checking deletedAt if it exists.
      // But Form model has isActive. Soft delete usually means isActive=false or adds deletedAt.
      // Design said "Soft delete form". I'll assume that means isActive=false or just hide them?
      // Spec: "User deletes a form ... it no longer appears in the list".
      // Let's filter by isActive=true if we treat delete as deactivate.
      // But user might want to toggle active status separately.
      // I'll show all forms for now, or just active ones?
      // Let's assume we want to see all non-deleted forms.
      // If delete simply sets isActive=false, then we hide them.
      // But 'isActive' is also for "Closed for submission".
      // I'll assume we show all forms, allowing user to filter in UI,
      // OR I should use a separate deleted flag.
      // Design: isActive: Boolean (Default: true).
      // Design: DELETE /api/forms/:id: Soft delete form.
      // I'll assume Soft Delete means removing it from the list.
      // However, usually isActive implies "Published".
      // I'll skip filtering by isActive here so owner can see inactive forms too.
      // To implement soft delete properly, I might need a status field or `deletedAt`.
      // For now, I'll return all forms for the user.
      where: { createdById: userId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { responses: true },
        },
      },
    });

    res.json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
