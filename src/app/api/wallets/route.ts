import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

const createWalletSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["DIGITAL_WALLET", "BANK", "CASH", "CRYPTO"]),
  balance: z.number().default(0),
  currency: z.string().default("ARS"),
  provider: z.string().optional().nullable(),
  config: z.record(z.string(), z.unknown()).optional().nullable(),
});

export async function GET() {
  try {
    const wallets = await prisma.wallet.findMany({
      include: {
        _count: { select: { transactions: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate actual balance from transactions for each wallet
    const walletsWithBalance = await Promise.all(
      wallets.map(async (wallet) => {
        const [income, expenses] = await Promise.all([
          prisma.transaction.aggregate({
            where: { walletId: wallet.id, type: "INCOME" },
            _sum: { amount: true },
          }),
          prisma.transaction.aggregate({
            where: { walletId: wallet.id, type: "EXPENSE" },
            _sum: { amount: true },
          }),
        ]);

        const calculatedBalance =
          Number(income._sum.amount ?? 0) - Number(expenses._sum.amount ?? 0);

        return {
          ...wallet,
          calculatedBalance,
          transactionCount: wallet._count.transactions,
        };
      })
    );

    return NextResponse.json({ success: true, data: walletsWithBalance });
  } catch (error) {
    console.error("GET /api/wallets error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch wallets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createWalletSchema.parse(body);

    const { config, ...rest } = validated;
    const wallet = await prisma.wallet.create({
      data: {
        ...rest,
        ...(config !== undefined && {
          config: config === null ? Prisma.JsonNull : (config as Prisma.InputJsonValue),
        }),
      },
    });

    return NextResponse.json(
      { success: true, data: wallet },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    console.error("POST /api/wallets error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create wallet" },
      { status: 500 }
    );
  }
}
