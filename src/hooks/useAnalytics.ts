import { useState, useCallback } from "react";

interface CategorySpending {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

interface DailySpending {
  date: string;
  amount: number;
}

interface AnalyticsData {
  period: string;
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  savingsRate: number;
  spendingByCategory: CategorySpending[];
  monthlyTrend: MonthlyTrend[];
  dailySpending: DailySpending[];
  topTransactions: unknown[];
}

type Period = "thisMonth" | "lastMonth" | "last3Months" | "thisYear";

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("thisMonth");

  const fetchAnalytics = useCallback(async (selectedPeriod?: Period) => {
    setLoading(true);
    setError(null);
    try {
      const p = selectedPeriod ?? period;
      const params = new URLSearchParams({ period: p });

      const response = await fetch(`/api/analytics?${params.toString()}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch analytics");
      }

      setData(result.data);
      if (selectedPeriod) {
        setPeriod(selectedPeriod);
      }

      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [period]);

  const changePeriod = useCallback(
    (newPeriod: Period) => {
      setPeriod(newPeriod);
    },
    []
  );

  return {
    data,
    loading,
    error,
    period,
    changePeriod,
    fetchAnalytics,
  };
}
