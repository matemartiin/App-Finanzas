import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format as dateFnsFormat } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Merge class names with Tailwind CSS conflict resolution.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as currency (defaults to Argentine Peso).
 */
export function formatCurrency(
  amount: number,
  currency: string = "ARS"
): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date using date-fns with Spanish locale.
 */
export function formatDate(
  date: Date | string | number,
  formatStr: string = "dd/MM/yyyy"
): string {
  const parsedDate =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;

  return dateFnsFormat(parsedDate, formatStr, { locale: es });
}

/**
 * Parse a currency string to a number.
 * Handles formats like "$1.234,56" or "1234.56".
 */
export function parseAmount(str: string): number {
  const cleaned = str
    .replace(/[^0-9.,-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Generate a simple unique ID.
 */
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
