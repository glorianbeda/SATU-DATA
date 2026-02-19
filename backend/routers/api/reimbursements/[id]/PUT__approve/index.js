const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * PUT /api/reimbursements/:id/approve
 * Approve or reject a reimbursement request
 */
module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const adminId = req.user.id;

    // Validate status
    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Status tidak valid' });
    }

    // Find existing reimbursement
    const reimbursement = await prisma.reimbursement.findUnique({
      where: { id: parseInt(id) },
    });

    if (!reimbursement) {
      return res.status(404).json({ error: 'Reimbursement tidak ditemukan' });
    }

    // Check if already processed
    if (reimbursement.status !== 'PENDING') {
      return res.status(400).json({ error: 'Reimbursement sudah diproses' });
    }

    // Update reimbursement
    const updated = await prisma.reimbursement.update({
      where: { id: parseInt(id) },
      data: {
        status,
        approvedById: adminId,
        approvedAt: new Date(),
        notes: notes || null,
        rejectionReason: status === 'REJECTED' ? (notes || 'Permintaan ditolak') : null,
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
    console.error('Error approving/rejecting reimbursement:', error);
    res.status(500).json({ error: 'Gagal memproses reimbursement' });
  }
};
