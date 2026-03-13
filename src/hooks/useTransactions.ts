import { useState, useCallback } from "react";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  date: string;
  categoryId: string | null;
  category?: { id: string; name: string; icon: string; color: string };
  walletId: string | null;
  wallet?: { id: string; name: string; type: string };
  tags?: { id: string; name: string }[];
  notes: string | null;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TransactionFilters {
  type?: string;
  categoryId?: string;
  walletId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface CreateTransactionInput {
  amount: number;
  type: string;
  description: string;
  date: string;
  categoryId?: string | null;
  walletId?: string | null;
  isRecurring?: boolean;
  tags?: string[];
  notes?: string | null;
}

interface UpdateTransactionInput extends Partial<CreateTransactionInput> {}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    pageSize: 20,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });

  const fetchTransactions = useCallback(async (filters: TransactionFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.set(key, String(value));
        }
      });

      const response = await fetch(`/api/transactions?${params.toString()}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch transactions");
      }

      setTransactions(result.data);
      setPagination({
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages,
        hasNext: result.hasNext,
        hasPrevious: result.hasPrevious,
      });

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTransaction = useCallback(async (data: CreateTransactionInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to create transaction");
      }

      setTransactions((prev) => [result.data, ...prev]);
      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTransaction = useCallback(async (id: string, data: UpdateTransactionInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to update transaction");
      }

      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? result.data : t))
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

  const deleteTransaction = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to delete transaction");
      }

      setTransactions((prev) => prev.filter((t) => t.id !== id));
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
    transactions,
    loading,
    error,
    pagination,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
