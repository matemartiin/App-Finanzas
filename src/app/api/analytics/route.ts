import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function getPeriodDates(period: string): { start: Date; end: Date } {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  switch (period) {
    case "lastMonth": {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      return { start, end: monthEnd };
    }
    case "last3Months": {
      const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      return { start, end };
    }
    case "thisYear": {
      const start = new Date(now.getFullYear(), 0, 1);
      return { start, end };
    }
    case "thisMonth":
    default: {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start, end };
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "thisMonth";

    const { start, end } = getPeriodDates(period);

    // Total income and expenses for the period
    const [incomeAgg, expenseAgg] = await Promise.all([
      prisma.transaction.aggregate({
        where: { type: "INCOME", date: { gte: start, lte: end } },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { type: "EXPENSE", date: { gte: start, lte: end } },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = Number(incomeAgg._sum.amount ?? 0);
    const totalExpenses = Number(expenseAgg._sum.amount ?? 0);
    const savings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;

    // Spending by category
    const categorySpending = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: { type: "EXPENSE", date: { gte: start, lte: end }, categoryId: { not: null } },
      _sum: { amount: true },
      _count: true,
      orderBy: { _sum: { amount: "desc" } },
    });

    // Get category details
    const categoryIds = categorySpending
      .map((cs) => cs.categoryId)
      .filter((id): id is string => id !== null);

    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
    });

    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    const spendingByCategory = categorySpending.map((cs) => {
      const cat = categoryMap.get(cs.categoryId!);
      const amount = Number(cs._sum.amount ?? 0);
      return {
        categoryId: cs.categoryId!,
        categoryName: cat?.name ?? "Unknown",
        categoryIcon: cat?.icon ?? "📦",
        categoryColor: cat?.color ?? "#888888",
        amount,
        percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
        transactionCount: cs._count,
      };
    });

    // Monthly trend - get data for the last 12 months
    const trendStart = new Date(end.getFullYear() - 1, end.getMonth() + 1, 1);
    const monthlyTransactions = await prisma.transaction.findMany({
      where: { date: { gte: trendStart, lte: end } },
      select: { amount: true, type: true, date: true },
    });

    const monthlyTrendMap = new Map<
      string,
      { income: number; expenses: number }
    >();

    for (const tx of monthlyTransactions) {
      const key = `${tx.date.getFullYear()}-${String(tx.date.getMonth() + 1).padStart(2, "0")}`;
      if (!monthlyTrendMap.has(key)) {
        monthlyTrendMap.set(key, { income: 0, expenses: 0 });
      }
      const entry = monthlyTrendMap.get(key)!;
      const amount = Number(tx.amount);
      if (tx.type === "INCOME") {
        entry.income += amount;
      } else if (tx.type === "EXPENSE") {
        entry.expenses += amount;
      }
    }

    const monthlyTrend = Array.from(monthlyTrendMap.entries())
      .map(([month, data]) => ({
        month,
        income: Math.round(data.income * 100) / 100,
        expenses: Math.round(data.expenses * 100) / 100,
        balance: Math.round((data.income - data.expenses) * 100) / 100,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Daily spending for the selected period
    const dailyTransactions = await prisma.transaction.findMany({
      where: { type: "EXPENSE", date: { gte: start, lte: end } },
      select: { amount: true, date: true },
    });

    const dailyMap = new Map<string, number>();
    for (const tx of dailyTransactions) {
      const key = tx.date.toISOString().split("T")[0];
      dailyMap.set(key, (dailyMap.get(key) || 0) + Number(tx.amount));
    }

    const dailySpending = Array.from(dailyMap.entries())
      .map(([date, amount]) => ({
        date,
        amount: Math.round(amount * 100) / 100,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Top transactions (biggest expenses)
    const topTransactions = await prisma.transaction.findMany({
      where: { type: "EXPENSE", date: { gte: start, lte: end } },
      include: { category: true, wallet: true },
      orderBy: { amount: "desc" },
      take: 10,
    });

    return NextResponse.json({
      success: true,
      data: {
        period,
        startDate: start,
        endDate: end,
        totalIncome,
        totalExpenses,
        savings,
        savingsRate,
        spendingByCategory,
        monthlyTrend,
        dailySpending,
        topTransactions,
      },
    });
  } catch (error) {
    console.error("GET /api/analytics error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
