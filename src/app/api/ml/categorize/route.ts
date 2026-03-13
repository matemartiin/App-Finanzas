import { NextRequest, NextResponse } from "next/server";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, amount, type } = body;

    if (!description) {
      return NextResponse.json(
        { success: false, error: "Description is required" },
        { status: 400 }
      );
    }

    // Forward to ML service for category suggestion
    const mlResponse = await fetch(`${ML_SERVICE_URL}/categorize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description,
        amount: amount || null,
        type: type || null,
      }),
    });

    if (!mlResponse.ok) {
      const errorData = await mlResponse.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: "ML categorization failed",
          details: errorData,
        },
        { status: mlResponse.status }
      );
    }

    const result = await mlResponse.json();

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("POST /api/ml/categorize error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to categorize transaction" },
      { status: 500 }
    );
  }
}
