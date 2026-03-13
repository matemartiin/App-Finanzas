import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const createBudgetSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  period: z.enum(["WEEKLY", "MONTHLY", "YEARLY"]),
  categoryId: z.string().min(1, "Category is required"),
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z.string().transform((val) => new Date(val)),
});

export async function GET() {
  try {
    const budgets = await prisma.budget.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    // Calculate actual spent from transactions for each budget
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const result = await prisma.transaction.aggregate({
          where: {
            categoryId: budget.categoryId,
            type: "EXPENSE",
            date: {
              gte: budget.startDate,
              lte: budget.endDate,
            },
          },
          _sum: { amount: true },
        });

        const actualSpent = Number(result._sum.amount ?? 0);

        return {
          ...budget,
          spent: actualSpent,
          remaining: Number(budget.amount) - actualSpent,
          percentage:
            Number(budget.amount) > 0
              ? Math.round((actualSpent / Number(budget.amount)) * 100)
              : 0,
        };
      })
    );

    return NextResponse.json({ success: true, data: budgetsWithSpent });
  } catch (error) {
    console.error("GET /api/budgets error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch budgets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createBudgetSchema.parse(body);

    const budget = await prisma.budget.create({
      data: validated,
      include: { category: true },
    });

    return NextResponse.json(
      { success: true, data: budget },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    console.error("POST /api/budgets error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create budget" },
      { status: 500 }
    );
  }
}
