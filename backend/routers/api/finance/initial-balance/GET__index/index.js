const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    // Get or create finance settings
    let settings = await prisma.financeSettings.findFirst();
    if (!settings) {
      settings = await prisma.financeSettings.create({
        data: { initialBalance: 0, balanceDate: new Date() },
      });
    }

    // Calculate income/expense only for transactions AFTER the balance date
    const [income, expense] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          type: "INCOME",
          date: { gt: settings.balanceDate },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          type: "EXPENSE",
          date: { gt: settings.balanceDate },
        },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = income._sum.amount || 0;
    const totalExpense = expense._sum.amount || 0;
    const currentBalance = settings.initialBalance + totalIncome - totalExpense;

    res.json({
      initialBalance: settings.initialBalance,
      balanceDate: settings.balanceDate,
      incomeAfterDate: totalIncome,
      expenseAfterDate: totalExpense,
      currentBalance,
    });
  } catch (error) {
    console.error("Get initial balance error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
