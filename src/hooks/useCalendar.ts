import { useState, useCallback } from "react";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  type: string;
  amount?: number;
  isCompleted: boolean;
  isRecurring?: boolean;
  recurringTransactionId?: string;
  frequency?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateEventInput {
  title: string;
  description?: string;
  date: string;
  type: string;
  amount?: number;
  isCompleted?: boolean;
}

interface UpdateEventInput extends Partial<CreateEventInput> {}

export function useCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { month: now.getMonth() + 1, year: now.getFullYear() };
  });

  const fetchEvents = useCallback(
    async (month?: number, year?: number) => {
      setLoading(true);
      setError(null);
      try {
        const m = month ?? currentMonth.month;
        const y = year ?? currentMonth.year;
        const params = new URLSearchParams({ month: String(m), year: String(y) });

        const response = await fetch(`/api/calendar?${params.toString()}`);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to fetch calendar events");
        }

        setEvents(result.data.all || []);
        return result.data;
      } catch (err) {
        const message = err instanceof Error ? err.message : "An error occurred";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentMonth.month, currentMonth.year]
  );

  const nextMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      if (prev.month === 12) {
        return { month: 1, year: prev.year + 1 };
      }
      return { month: prev.month + 1, year: prev.year };
    });
  }, []);

  const prevMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      if (prev.month === 1) {
        return { month: 12, year: prev.year - 1 };
      }
      return { month: prev.month - 1, year: prev.year };
    });
  }, []);

  const createEvent = useCallback(async (data: CreateEventInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to create event");
      }

      setEvents((prev) =>
        [...prev, { ...result.data, isRecurring: false }].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
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

  const updateEvent = useCallback(async (id: string, data: UpdateEventInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/calendar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to update event");
      }

      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...result.data, isRecurring: false } : e))
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

  const deleteEvent = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/calendar/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to delete event");
      }

      setEvents((prev) => prev.filter((e) => e.id !== id));
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
    events,
    loading,
    error,
    currentMonth,
    nextMonth,
    prevMonth,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}
