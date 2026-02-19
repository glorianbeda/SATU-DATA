const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/reimbursements/:id/receipt
 * Generate a receipt for a completed reimbursement
 */
module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    // Find reimbursement with user data
    const reimbursement = await prisma.reimbursement.findUnique({
      where: { id: parseInt(id) },
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

    if (!reimbursement) {
      return res.status(404).json({ error: 'Reimbursement tidak ditemukan' });
    }

    if (reimbursement.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Nota hanya tersedia untuk reimbursement yang sudah selesai' });
    }

    // Generate receipt data
    const receiptData = {
      receiptNumber: `RMB-${reimbursement.id.toString().padStart(6, '0')}`,
      date: new Date(reimbursement.completedAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      beneficiary: {
        name: reimbursement.user.name,
        email: reimbursement.user.email,
      },
      amount: {
        nominal: reimbursement.amount,
        formatted: new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(reimbursement.amount),
      },
      disbursement: {
        method: reimbursement.disbursementMethod,
        accountNumber: reimbursement.accountNumber || 'Tunai',
      },
      approvedBy: reimbursement.approvedBy?.name || 'Admin',
      notes: reimbursement.notes,
    };

    res.json(receiptData);
  } catch (error) {
    console.error('Error generating receipt:', error);
    res.status(500).json({ error: 'Gagal menghasilkan nota' });
  }
};
