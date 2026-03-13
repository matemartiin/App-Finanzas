import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { months = 3 } = body;

    // Fetch transaction history for ML prediction
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);

    const transactions = await prisma.transaction.findMany({
      where: { date: { gte: startDate } },
      include: { category: true },
      orderBy: { date: "asc" },
    });

    const transactionHistory = transactions.map((tx) => ({
      amount: Number(tx.amount),
      type: tx.type,
      category: tx.category?.name || "Uncategorized",
      date: tx.date.toISOString(),
      description: tx.description,
    }));

    // Forward to ML service
    const mlResponse = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transactions: transactionHistory,
        months,
      }),
    });

    if (!mlResponse.ok) {
      const errorData = await mlResponse.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: "ML service prediction failed",
          details: errorData,
        },
        { status: mlResponse.status }
      );
    }

    const prediction = await mlResponse.json();

    return NextResponse.json({
      success: true,
      data: prediction,
    });
  } catch (error) {
    console.error("POST /api/ml/predict error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get prediction" },
      { status: 500 }
    );
  }
}
