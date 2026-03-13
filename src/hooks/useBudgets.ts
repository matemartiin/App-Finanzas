import { useState, useCallback } from "react";

interface Budget {
  id: string;
  amount: number;
  spent: number;
  remaining: number;
  percentage: number;
  period: string;
  categoryId: string;
  category?: { id: string; name: string; icon: string; color: string };
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateBudgetInput {
  amount: number;
  period: string;
  categoryId: string;
  startDate: string;
  endDate: string;
}

interface UpdateBudgetInput extends Partial<CreateBudgetInput> {}

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/budgets");
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch budgets");
      }

      setBudgets(result.data);
      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createBudget = useCallback(async (data: CreateBudgetInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to create budget");
      }

      setBudgets((prev) => [result.data, ...prev]);
      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBudget = useCallback(async (id: string, data: UpdateBudgetInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to update budget");
      }

      setBudgets((prev) =>
        prev.map((b) => (b.id === id ? result.data : b))
      );
      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBudget = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to delete budget");
      }

      setBudgets((prev) => prev.filter((b) => b.id !== id));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    budgets,
    loading,
    error,
    fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
  };
}
