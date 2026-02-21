const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

module.exports = [authMiddleware, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sessions = await prisma.loginSession.findMany({
      where: {
        loginAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        loginAt: true,
      },
      orderBy: {
        loginAt: "asc",
      },
    });

    const loginByDate = {};
    sessions.forEach((session) => {
      const dateKey = session.loginAt.toISOString().slice(0, 10);
      loginByDate[dateKey] = (loginByDate[dateKey] || 0) + 1;
    });

    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 150);

    const result = [];
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().slice(0, 10);
      result.push({
        date: dateKey,
        count: loginByDate[dateKey] || 0,
      });
    }

    res.json(result);
  } catch (error) {
    console.error("Login activity error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}];
