from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta
from typing import Any


class SpendingPredictor:
    """Predicts future spending by category using linear regression on date features."""

    def __init__(self) -> None:
        self._models: dict[str, LinearRegression] = {}
        self._categories: list[str] = []
        self._is_trained: bool = False

    def _extract_features(self, dates: pd.Series) -> np.ndarray:
        """Convert dates to numeric features: day-of-year, day-of-week, day-of-month."""
        dt = pd.to_datetime(dates)
        return np.column_stack([
            dt.dt.dayofyear.values,
            dt.dt.dayofweek.values,
            dt.dt.day.values,
            np.arange(len(dt)),  # ordinal sequence
        ])

    def train(self, transactions: list[dict[str, Any]]) -> dict[str, Any]:
        """
        Fit a LinearRegression model per category on historical transaction data.

        Args:
            transactions: List of dicts with keys: date, amount, category, type.

        Returns:
            Training summary with categories trained and sample counts.
        """
        if not transactions:
            return {"status": "no_data", "categories_trained": 0}

        df = pd.DataFrame(transactions)
        df["date"] = pd.to_datetime(df["date"])
        df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0)

        # Only train on expenses
        expense_df = df[df["type"] == "EXPENSE"].copy()
        if expense_df.empty:
            return {"status": "no_expense_data", "categories_trained": 0}

        self._categories = expense_df["category"].unique().tolist()
        trained_count = 0

        for category in self._categories:
            cat_df = expense_df[expense_df["category"] == category].sort_values("date")
            if len(cat_df) < 2:
                # For very small datasets, store the mean as a constant predictor
                self._models[category] = None  # type: ignore[assignment]
                continue

            features = self._extract_features(cat_df["date"])
            targets = cat_df["amount"].values.astype(float)

            model = LinearRegression()
            model.fit(features, targets)
            self._models[category] = model
            trained_count += 1

        self._is_trained = True
        return {
            "status": "trained",
            "categories_trained": trained_count,
            "categories": self._categories,
        }

    def predict(self, days: int = 30) -> list[dict[str, Any]]:
        """
        Predict daily spending by category for the next N days.

        Returns:
            List of dicts with date, category, and predicted_amount.
        """
        if not self._is_trained:
            return []

        today = datetime.now()
        future_dates = [today + timedelta(days=i) for i in range(1, days + 1)]
        future_series = pd.Series(future_dates)

        # Build ordinal offset from training data length
        base_ordinal = 100  # approximate continuation

        predictions: list[dict[str, Any]] = []

        for category in self._categories:
            model = self._models.get(category)

            for i, date in enumerate(future_dates):
                if model is not None:
                    features = np.array([[
                        date.timetuple().tm_yday,
                        date.weekday(),
                        date.day,
                        base_ordinal + i,
                    ]])
                    amount = max(0, float(model.predict(features)[0]))
                else:
                    # Fallback: no model available, use zero
                    amount = 0.0

                predictions.append({
                    "date": date.strftime("%Y-%m-%d"),
                    "category": category,
                    "predicted_amount": round(amount, 2),
                })

        return predictions

    def get_category_totals(self, days: int = 30) -> dict[str, float]:
        """Return predicted total spending per category over the next N days."""
        predictions = self.predict(days)
        totals: dict[str, float] = {}
        for p in predictions:
            cat = p["category"]
            totals[cat] = totals.get(cat, 0) + p["predicted_amount"]
        return {k: round(v, 2) for k, v in totals.items()}
