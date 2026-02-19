const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/reimbursements/my
 * Get current user's reimbursement requests
 */
module.exports = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;
    
    const where = {
      userId,
    };
    if (status) {
      where.status = status;
    }

    const total = await prisma.reimbursement.count({ where });
    const reimbursements = await prisma.reimbursement.findMany({
      where,
      include: {
        approvedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
    });

    res.json({
      reimbursements,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching my reimbursements:', error);
    res.status(500).json({ error: 'Failed to fetch your reimbursements' });
  }
};
