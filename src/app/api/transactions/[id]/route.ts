import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const updateTransactionSchema = z.object({
  amount: z.number().positive().optional(),
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]).optional(),
  description: z.string().min(1).optional(),
  date: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  categoryId: z.string().optional().nullable(),
  walletId: z.string().optional().nullable(),
  isRecurring: z.boolean().optional(),
  notes: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { category: true, wallet: true, tags: true, recurring: true },
    });

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: transaction });
  } catch (error) {
    console.error("GET /api/transactions/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch transaction" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const validated = updateTransactionSchema.parse(body);

    const existing = await prisma.transaction.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    const { tags, ...updateData } = validated;

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        ...updateData,
        tags: tags
          ? {
              set: [],
              connectOrCreate: tags.map((tag) => ({
                where: { name: tag },
                create: { name: tag },
              })),
            }
          : undefined,
      },
      include: { category: true, wallet: true, tags: true },
    });

    // Adjust wallet balance if amount or wallet changed
    const oldAmount = Number(existing.amount);
    const newAmount = validated.amount ?? oldAmount;
    const oldType = existing.type;
    const newType = validated.type ?? oldType;
    const oldWalletId = existing.walletId;
    const newWalletId = validated.walletId !== undefined ? validated.walletId : oldWalletId;

    // Reverse old transaction effect on old wallet
    if (oldWalletId) {
      const oldEffect = oldType === "INCOME" ? -oldAmount : oldAmount;
      await prisma.wallet.update({
        where: { id: oldWalletId },
        data: { balance: { increment: oldEffect } },
      });
    }

    // Apply new transaction effect on new wallet
    if (newWalletId) {
      const newEffect = newType === "INCOME" ? newAmount : -newAmount;
      await prisma.wallet.update({
        where: { id: newWalletId },
        data: { balance: { increment: newEffect } },
      });
    }

    return NextResponse.json({ success: true, data: transaction });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    console.error("PUT /api/transactions/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const existing = await prisma.transaction.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Reverse wallet balance effect
    if (existing.walletId) {
      const reversal =
        existing.type === "INCOME"
          ? -Number(existing.amount)
          : Number(existing.amount);

      await prisma.wallet.update({
        where: { id: existing.walletId },
        data: { balance: { increment: reversal } },
      });
    }

    await prisma.transaction.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Transaction deleted" });
  } catch (error) {
    console.error("DELETE /api/transactions/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
