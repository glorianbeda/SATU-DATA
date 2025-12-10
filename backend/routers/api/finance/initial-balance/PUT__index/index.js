const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    const { initialBalance, balanceDate } = req.body;
    const userId = req.user.id;

    if (initialBalance === undefined || !balanceDate) {
      return res
        .status(400)
        .json({
          error: "Missing required fields: initialBalance and balanceDate",
        });
    }

    // Get current settings for audit log
    let currentSettings = await prisma.financeSettings.findFirst();
    const oldBalance = currentSettings?.initialBalance || 0;
    const oldDate = currentSettings?.balanceDate || new Date();

    // Update or create settings
    if (currentSettings) {
      currentSettings = await prisma.financeSettings.update({
        where: { id: currentSettings.id },
        data: {
          initialBalance: parseFloat(initialBalance),
          balanceDate: new Date(balanceDate),
        },
      });
    } else {
      currentSettings = await prisma.financeSettings.create({
        data: {
          initialBalance: parseFloat(initialBalance),
          balanceDate: new Date(balanceDate),
        },
      });
    }

    // Create audit log
    await prisma.balanceAuditLog.create({
      data: {
        oldBalance,
        newBalance: currentSettings.initialBalance,
        oldDate,
        newDate: currentSettings.balanceDate,
        changedById: userId,
      },
    });

    // Recalculate current balance
    const [income, expense] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          type: "INCOME",
          date: { gt: currentSettings.balanceDate },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          type: "EXPENSE",
          date: { gt: currentSettings.balanceDate },
        },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = income._sum.amount || 0;
    const totalExpense = expense._sum.amount || 0;
    const calculatedBalance =
      currentSettings.initialBalance + totalIncome - totalExpense;

    res.json({
      message: "Balance updated successfully",
      initialBalance: currentSettings.initialBalance,
      balanceDate: currentSettings.balanceDate,
      incomeAfterDate: totalIncome,
      expenseAfterDate: totalExpense,
      currentBalance: calculatedBalance,
    });
  } catch (error) {
    console.error("Update initial balance error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
