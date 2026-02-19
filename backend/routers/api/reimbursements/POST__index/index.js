const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * POST /api/reimbursements
 * Create a new reimbursement request
 */
module.exports = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, evidenceImage, disbursementMethod, accountNumber } = req.body;

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Jumlah harus lebih dari 0' });
    }

    if (!disbursementMethod || !['CASH', 'BANK', 'CASHLESS'].includes(disbursementMethod)) {
      return res.status(400).json({ error: 'Metode pencairan tidak valid' });
    }

    if (disbursementMethod !== 'CASH' && !accountNumber) {
      return res.status(400).json({ error: 'Nomor rekening/HP wajib diisi untuk metode non-tunai' });
    }

    const reimbursement = await prisma.reimbursement.create({
      data: {
        userId,
        amount: parseFloat(amount),
        evidenceImage,
        disbursementMethod,
        accountNumber: disbursementMethod === 'CASH' ? null : accountNumber,
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(reimbursement);
  } catch (error) {
    console.error('Error creating reimbursement:', error);
    res.status(500).json({ error: 'Gagal mengajukan reimbursement' });
  }
};
