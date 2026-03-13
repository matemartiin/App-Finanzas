"""FinanzApp ML Service - FastAPI application for spending predictions, categorization, and anomaly detection."""

from __future__ import annotations

import logging
from typing import Any, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from models.predictor import SpendingPredictor
from models.categorizer import TransactionCategorizer
from utils.data_processor import DataProcessor

# ─── Logging ───────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

# ─── FastAPI app ───────────────────────────────────────────────────────────────

app = FastAPI(
    title="FinanzApp ML Service",
    description="Machine learning microservice for spending predictions, "
                "transaction categorization, and anomaly detection.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Singleton model instances ─────────────────────────────────────────────────

predictor = SpendingPredictor()
categorizer = TransactionCategorizer()
data_processor = DataProcessor()

# Pre-train the categorizer with fallback data so it works out of the box
categorizer.train_with_defaults()

# ─── Request / Response schemas ────────────────────────────────────────────────


class TransactionInput(BaseModel):
    date: str
    amount: float
    category: str
    type: str  # "INCOME" | "EXPENSE" | "TRANSFER"
    description: str = ""


class PredictRequest(BaseModel):
    transactions: list[TransactionInput] = Field(..., min_length=1)
    days: int = Field(default=30, ge=1, le=365)


class CategorizeRequest(BaseModel):
    description: str = Field(..., min_length=1)
    additional_training: Optional[list[dict[str, str]]] = None


class AnomaliesRequest(BaseModel):
    transactions: list[TransactionInput] = Field(..., min_length=1)
    threshold: float = Field(default=2.0, ge=1.0, le=5.0)


class CategorySuggestion(BaseModel):
    category: str
    confidence: float


class CategorizeResponse(BaseModel):
    suggestions: list[CategorySuggestion]


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str


# ─── Routes ────────────────────────────────────────────────────────────────────


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    """Health check endpoint."""
    return HealthResponse(
        status="healthy",
        service="finanzapp-ml",
        version="1.0.0",
    )


@app.post("/predict")
async def predict(request: PredictRequest) -> dict[str, Any]:
    """Takes transaction history and returns spending predictions for the next N days by category."""
    try:
        transactions = [t.model_dump() for t in request.transactions]
        logger.info("Predict request with %d transactions", len(transactions))

        train_result = predictor.train(transactions)
        logger.info("Training result: %s", train_result)

        predictions = predictor.predict(days=request.days)
        category_totals = predictor.get_category_totals(days=request.days)

        # Group predictions by category for a cleaner response
        by_category: dict[str, list[dict[str, Any]]] = {}
        for p in predictions:
            cat = p["category"]
            by_category.setdefault(cat, []).append({
                "date": p["date"],
                "predicted_amount": p["predicted_amount"],
            })

        return {
            "training_summary": train_result,
            "predictions_by_category": by_category,
            "category_totals": category_totals,
            "total_predictions": len(predictions),
        }
    except Exception as exc:
        logger.exception("Error in /predict")
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/categorize", response_model=CategorizeResponse)
async def categorize(request: CategorizeRequest) -> CategorizeResponse:
    """Takes a transaction description and returns suggested category with confidence."""
    try:
        logger.info("Categorize request: %r", request.description)

        # Optionally train on additional data
        if request.additional_training:
            descriptions = [d.get("description", "") for d in request.additional_training]
            categories = [d.get("category", "") for d in request.additional_training]
            if descriptions and categories:
                categorizer.train(descriptions, categories)

        results = categorizer.predict(request.description)

        return CategorizeResponse(
            suggestions=[
                CategorySuggestion(category=cat, confidence=round(conf, 4))
                for cat, conf in results
            ]
        )
    except Exception as exc:
        logger.exception("Error in /categorize")
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/anomalies")
async def anomalies(request: AnomaliesRequest) -> dict[str, Any]:
    """Takes transaction history and returns detected anomalies."""
    try:
        transactions = [t.model_dump() for t in request.transactions]
        logger.info("Anomalies request with %d transactions", len(transactions))

        detected = data_processor.detect_anomalies(transactions, threshold=request.threshold)
        trends = data_processor.calculate_trends(transactions)
        logger.info("Detected %d anomalies", len(detected))

        return {
            "anomalies": detected,
            "total_analyzed": len(transactions),
            "trends": trends,
        }
    except Exception as exc:
        logger.exception("Error in /anomalies")
        raise HTTPException(status_code=500, detail=str(exc)) from exc
