import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const MP_API_BASE = "https://api.mercadopago.com";

async function getMPAccessToken(walletId: string): Promise<string | null> {
  const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
  if (!wallet?.config) return null;
  const config = wallet.config as Record<string, unknown>;
  return (config.accessToken as string) || null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletId = searchParams.get("walletId");

    if (!walletId) {
      return NextResponse.json(
        { success: false, error: "walletId is required" },
        { status: 400 }
      );
    }

    const accessToken = await getMPAccessToken(walletId);
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Mercado Pago not configured for this wallet" },
        { status: 400 }
      );
    }

    const limit = searchParams.get("limit") || "50";
    const offset = searchParams.get("offset") || "0";

    const response = await fetch(
      `${MP_API_BASE}/v1/payments/search?sort=date_created&criteria=desc&limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, error: "Failed to fetch from Mercado Pago", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: {
        transactions: data.results || [],
        paging: data.paging || { total: 0, limit: 50, offset: 0 },
      },
    });
  } catch (error) {
    console.error("GET /api/wallets/mercadopago error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch Mercado Pago transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletId } = body;

    if (!walletId) {
      return NextResponse.json(
        { success: false, error: "walletId is required" },
        { status: 400 }
      );
    }

    const accessToken = await getMPAccessToken(walletId);
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Mercado Pago not configured for this wallet" },
        { status: 400 }
      );
    }

    const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
    const lastSync = wallet?.lastSync || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const beginDate = lastSync.toISOString();
    const endDate = new Date().toISOString();

    const response = await fetch(
      `${MP_API_BASE}/v1/payments/search?sort=date_created&criteria=desc&begin_date=${beginDate}&end_date=${endDate}&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch from Mercado Pago API" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const mpTransactions = data.results || [];

    let createdCount = 0;
    let skippedCount = 0;

    for (const mpTx of mpTransactions) {
      const isIncome =
        mpTx.operation_type === "regular_payment" &&
        mpTx.status === "approved" &&
        mpTx.transaction_amount > 0;

      const type = isIncome ? "INCOME" : "EXPENSE";
      const amount = Math.abs(mpTx.transaction_amount || 0);

      if (amount === 0) {
        skippedCount++;
        continue;
      }

      const existingDate = new Date(mpTx.date_created);
      const existing = await prisma.transaction.findFirst({
        where: {
          walletId,
          amount,
          date: existingDate,
          description: { contains: mpTx.description || "" },
        },
      });

      if (existing) {
        skippedCount++;
        continue;
      }

      await prisma.transaction.create({
        data: {
          amount,
          type,
          description: mpTx.description || `MP: ${mpTx.operation_type}`,
          date: existingDate,
          walletId,
          notes: `Mercado Pago ID: ${mpTx.id}`,
        },
      });

      const balanceChange = type === "INCOME" ? amount : -amount;
      await prisma.wallet.update({
        where: { id: walletId },
        data: { balance: { increment: balanceChange } },
      });

      createdCount++;
    }

    await prisma.wallet.update({
      where: { id: walletId },
      data: { lastSync: new Date() },
    });

    return NextResponse.json({
      success: true,
      data: { total: mpTransactions.length, createdCount, skippedCount, lastSync: new Date() },
    });
  } catch (error) {
    console.error("POST /api/wallets/mercadopago error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to sync Mercado Pago transactions" },
      { status: 500 }
    );
  }
}
