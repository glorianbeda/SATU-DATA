const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

// Predefined categories with descriptions
const CATEGORIES = [
  {
    value: "Surat Masuk",
    description: "Surat yang diterima dari pihak eksternal",
  },
  {
    value: "Surat Keluar",
    description: "Surat yang dikirim ke pihak eksternal",
  },
  {
    value: "Laporan",
    description: "Laporan kegiatan, keuangan, atau progress",
  },
  { value: "Kontrak", description: "Kontrak, perjanjian, MoU" },
  { value: "Keuangan", description: "Dokumen keuangan, invoice, kwitansi" },
  { value: "SDM", description: "Dokumen kepegawaian, SK, absensi" },
  { value: "Foto", description: "Foto dan dokumentasi kegiatan" },
  {
    value: "Lainnya",
    description: "Dokumen lainnya yang tidak termasuk kategori di atas",
  },
];

/**
 * GET /api/archives
 * List all archives with filtering and search
 */
const handler = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      category,
      search,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const where = {
      uploadedById: userId,
    };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { originalName: { contains: search } },
        { filename: { contains: search } },
      ];
    }

    const [archives, total] = await Promise.all([
      prisma.archive.findMany({
        where,
        include: {
          uploadedBy: { select: { id: true, name: true } },
          _count: { select: { shares: true, childVersions: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.archive.count({ where }),
    ]);

    res.json({
      archives,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
      categories: CATEGORIES,
    });
  } catch (error) {
    console.error("Get archives error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
module.exports.CATEGORIES = CATEGORIES;
