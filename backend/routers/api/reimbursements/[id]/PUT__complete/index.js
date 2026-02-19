const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * PUT /api/reimbursements/:id/complete
 * Mark a reimbursement as completed (admin only)
 */
module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    // Find existing reimbursement
    const reimbursement = await prisma.reimbursement.findUnique({
      where: { id: parseInt(id) },
    });

    if (!reimbursement) {
      return res.status(404).json({ error: 'Reimbursement tidak ditemukan' });
    }

    // Check if already approved (can only complete approved requests)
    if (reimbursement.status !== 'APPROVED') {
      return res.status(400).json({ error: 'H reimburse yang sudah disetujui dapat ditandai selesai' });
    }

    // Update reimbursement to completed
    const updated = await prisma.reimbursement.update({
      where: { id: parseInt(id) },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error completing reimbursement:', error);
    res.status(500).json({ error: 'Gagal menyelesaikan reimbursement' });
  }
};
