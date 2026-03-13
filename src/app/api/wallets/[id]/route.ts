import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

const updateWalletSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.enum(["DIGITAL_WALLET", "BANK", "CASH", "CRYPTO"]).optional(),
  balance: z.number().optional(),
  currency: z.string().optional(),
  provider: z.string().optional().nullable(),
  isConnected: z.boolean().optional(),
  config: z.record(z.string(), z.unknown()).optional().nullable(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const validated = updateWalletSchema.parse(body);

    const existing = await prisma.wallet.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Wallet not found" },
        { status: 404 }
      );
    }

    const { config, ...rest } = validated;
    const data: Prisma.WalletUpdateInput = {
      ...rest,
      ...(config !== undefined && {
        config: config === null ? Prisma.JsonNull : (config as Prisma.InputJsonValue),
      }),
    };

    const wallet = await prisma.wallet.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, data: wallet });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    console.error("PUT /api/wallets/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update wallet" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const existing = await prisma.wallet.findUnique({
      where: { id },
      include: { _count: { select: { transactions: true } } },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Wallet not found" },
        { status: 404 }
      );
    }

    if (existing._count.transactions > 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Cannot delete wallet with existing transactions. Remove or reassign transactions first.",
        },
        { status: 400 }
      );
    }

    await prisma.wallet.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Wallet deleted" });
  } catch (error) {
    console.error("DELETE /api/wallets/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete wallet" },
      { status: 500 }
    );
  }
}
