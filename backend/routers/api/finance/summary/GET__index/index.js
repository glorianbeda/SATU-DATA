const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = {};
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const [income, expense] = await Promise.all([
      prisma.transaction.aggregate({
        where: { ...where, type: "INCOME" },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { ...where, type: "EXPENSE" },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = income._sum.amount || 0;
    const totalExpense = expense._sum.amount || 0;
    const balance = totalIncome - totalExpense;

    // Get monthly data for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await prisma.transaction.findMany({
      where: {
        date: { gte: sixMonthsAgo },
      },
      orderBy: { date: "asc" },
    });

    const chartData = monthlyData.reduce((acc, curr) => {
      const month = curr.date.toISOString().slice(0, 7); // YYYY-MM
      if (!acc[month]) acc[month] = { income: 0, expense: 0 };
      if (curr.type === "INCOME") acc[month].income += curr.amount;
      else acc[month].expense += curr.amount;
      return acc;
    }, {});

    res.json({
      summary: {
        totalIncome,
        totalExpense,
        balance,
      },
      chartData,
    });
  } catch (error) {
    console.error("Get finance summary error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
