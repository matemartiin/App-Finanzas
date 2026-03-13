import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Papa from "papaparse";

interface GenericCSVRow {
  date?: string;
  fecha?: string;
  description?: string;
  descripcion?: string;
  concepto?: string;
  amount?: string;
  monto?: string;
  importe?: string;
  type?: string;
  tipo?: string;
}

interface MercadoPagoCSVRow {
  Fecha?: string;
  Descripcion?: string;
  Monto?: string;
  Estado?: string;
  Tipo?: string;
}

interface BankStatementRow {
  Fecha?: string;
  Concepto?: string;
  Debito?: string;
  Credito?: string;
  Saldo?: string;
}

type CSVRow = GenericCSVRow & MercadoPagoCSVRow & BankStatementRow;

function detectFormat(headers: string[]): "generic" | "mercadopago" | "bank" {
  const lowerHeaders = headers.map((h) => h.toLowerCase().trim());

  if (
    lowerHeaders.includes("estado") &&
    (lowerHeaders.includes("descripcion") || lowerHeaders.includes("descripción"))
  ) {
    return "mercadopago";
  }

  if (
    lowerHeaders.includes("debito") ||
    lowerHeaders.includes("credito") ||
    lowerHeaders.includes("débito") ||
    lowerHeaders.includes("crédito") ||
    lowerHeaders.includes("saldo")
  ) {
    return "bank";
  }

  return "generic";
}

function parseAmount(value: string | undefined): number {
  if (!value) return 0;
  const cleaned = value
    .replace(/[^0-9.,-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  return Math.abs(parseFloat(cleaned) || 0);
}

function parseDate(value: string | undefined): Date {
  if (!value) return new Date();
  const parsed = new Date(value);
  if (!isNaN(parsed.getTime())) return parsed;

  // Try DD/MM/YYYY
  const parts = value.split(/[/\-]/);
  if (parts.length === 3) {
    const [day, month, year] = parts;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (!isNaN(date.getTime())) return date;
  }

  return new Date();
}

function parseRow(
  row: CSVRow,
  format: "generic" | "mercadopago" | "bank",
  walletId: string
) {
  switch (format) {
    case "mercadopago": {
      const amount = parseAmount(row.Monto);
      const type =
        row.Tipo?.toLowerCase().includes("ingreso") ||
        (row.Monto && !row.Monto.startsWith("-"))
          ? "INCOME"
          : "EXPENSE";

      return {
        amount,
        type: type as "INCOME" | "EXPENSE",
        description: row.Descripcion || "Mercado Pago transaction",
        date: parseDate(row.Fecha),
        walletId,
      };
    }

    case "bank": {
      const debit = parseAmount(row.Debito);
      const credit = parseAmount(row.Credito);
      const isIncome = credit > 0;

      return {
        amount: isIncome ? credit : debit,
        type: (isIncome ? "INCOME" : "EXPENSE") as "INCOME" | "EXPENSE",
        description: row.Concepto || "Bank transaction",
        date: parseDate(row.Fecha),
        walletId,
      };
    }

    default: {
      const amount = parseAmount(row.amount || row.monto || row.importe);
      const typeRaw = (row.type || row.tipo || "").toLowerCase();
      const type =
        typeRaw.includes("income") || typeRaw.includes("ingreso")
          ? "INCOME"
          : "EXPENSE";

      return {
        amount,
        type: type as "INCOME" | "EXPENSE",
        description:
          row.description || row.descripcion || row.concepto || "Imported transaction",
        date: parseDate(row.date || row.fecha),
        walletId,
      };
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const walletId = formData.get("walletId") as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    if (!walletId) {
      return NextResponse.json(
        { success: false, error: "walletId is required" },
        { status: 400 }
      );
    }

    const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) {
      return NextResponse.json(
        { success: false, error: "Wallet not found" },
        { status: 404 }
      );
    }

    const text = await file.text();
    const parsed = Papa.parse<CSVRow>(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
    });

    if (parsed.errors.length > 0 && parsed.data.length === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to parse CSV", details: parsed.errors },
        { status: 400 }
      );
    }

    const headers = parsed.meta.fields || [];
    const format = detectFormat(headers);

    const transactions = parsed.data
      .map((row) => parseRow(row, format, walletId))
      .filter((t) => t.amount > 0);

    let createdCount = 0;
    for (const txData of transactions) {
      await prisma.transaction.create({ data: txData });

      const balanceChange =
        txData.type === "INCOME" ? txData.amount : -txData.amount;
      await prisma.wallet.update({
        where: { id: walletId },
        data: { balance: { increment: balanceChange } },
      });

      createdCount++;
    }

    return NextResponse.json({
      success: true,
      data: {
        format,
        totalRows: parsed.data.length,
        createdCount,
        skippedCount: parsed.data.length - createdCount,
      },
    });
  } catch (error) {
    console.error("POST /api/wallets/import error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to import transactions" },
      { status: 500 }
    );
  }
}
