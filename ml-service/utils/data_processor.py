"""DataProcessor - Data preparation, anomaly detection, and trend analysis utilities."""

from __future__ import annotations

import numpy as np
import pandas as pd
from typing import Any


class DataProcessor:
    """Utilities for preparing training data, detecting anomalies, and calculating trends."""

    def prepare_training_data(self, transactions: list[dict[str, Any]]) -> pd.DataFrame:
        """
        Convert a list of transaction dicts into a clean pandas DataFrame.

        Args:
            transactions: List of dicts with keys: date, amount, category, type, description.

        Returns:
            Cleaned DataFrame with proper dtypes.
        """
        if not transactions:
            return pd.DataFrame(columns=["date", "amount", "category", "type", "description"])

        df = pd.DataFrame(transactions)
        df["date"] = pd.to_datetime(df["date"], errors="coerce")
        df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0).astype(float)

        # Ensure required columns exist
        for col in ["category", "type", "description"]:
            if col not in df.columns:
                df[col] = ""

        df = df.dropna(subset=["date"])
        df = df.sort_values("date").reset_index(drop=True)

        return df

    def detect_anomalies(
        self,
        transactions: list[dict[str, Any]],
        threshold: float = 2.0,
    ) -> list[dict[str, Any]]:
        """
        Detect anomalous transactions using z-score analysis per category.

        Transactions with a z-score above the threshold are flagged as anomalies.

        Args:
            transactions: List of transaction dicts.
            threshold: Z-score threshold for anomaly detection (default 2.0).

        Returns:
            List of anomaly dicts with z_score and severity fields.
        """
        df = self.prepare_training_data(transactions)

        if df.empty:
            return []

        # Only analyze expenses
        expense_df = df[df["type"] == "EXPENSE"].copy()
        if expense_df.empty:
            return []

        anomalies: list[dict[str, Any]] = []

        for category in expense_df["category"].unique():
            cat_df = expense_df[expense_df["category"] == category]

            if len(cat_df) < 3:
                # Not enough data points for meaningful z-score calculation
                continue

            mean_amount = cat_df["amount"].mean()
            std_amount = cat_df["amount"].std()

            if std_amount == 0:
                # All transactions have the same amount; no anomalies possible
                continue

            for _, row in cat_df.iterrows():
                z_score = abs((row["amount"] - mean_amount) / std_amount)

                if z_score >= threshold:
                    severity = "high" if z_score >= threshold * 1.5 else "medium"

                    anomalies.append({
                        "description": str(row.get("description", "")),
                        "amount": float(row["amount"]),
                        "date": row["date"].strftime("%Y-%m-%d") if pd.notna(row["date"]) else "",
                        "category": str(category),
                        "z_score": round(float(z_score), 2),
                        "severity": severity,
                    })

        # Sort by z_score descending
        anomalies.sort(key=lambda x: x["z_score"], reverse=True)
        return anomalies

    def calculate_trends(self, transactions: list[dict[str, Any]]) -> dict[str, Any]:
        """
        Calculate monthly spending trends from transaction history.

        Args:
            transactions: List of transaction dicts.

        Returns:
            Dict with monthly_totals, category_breakdown, and month_over_month changes.
        """
        df = self.prepare_training_data(transactions)

        if df.empty:
            return {"monthly_totals": {}, "category_breakdown": {}, "month_over_month": {}}

        expense_df = df[df["type"] == "EXPENSE"].copy()
        if expense_df.empty:
            return {"monthly_totals": {}, "category_breakdown": {}, "month_over_month": {}}

        expense_df["year_month"] = expense_df["date"].dt.to_period("M").astype(str)

        # Monthly totals
        monthly_totals = (
            expense_df.groupby("year_month")["amount"]
            .sum()
            .round(2)
            .to_dict()
        )

        # Category breakdown per month
        category_breakdown: dict[str, dict[str, float]] = {}
        for (month, cat), group in expense_df.groupby(["year_month", "category"]):
            month_str = str(month)
            if month_str not in category_breakdown:
                category_breakdown[month_str] = {}
            category_breakdown[month_str][str(cat)] = round(float(group["amount"].sum()), 2)

        # Month-over-month percentage change
        sorted_months = sorted(monthly_totals.keys())
        month_over_month: dict[str, float | None] = {}

        for i, month in enumerate(sorted_months):
            if i == 0:
                month_over_month[month] = None
            else:
                prev_total = monthly_totals[sorted_months[i - 1]]
                curr_total = monthly_totals[month]
                if prev_total > 0:
                    change = ((curr_total - prev_total) / prev_total) * 100
                    month_over_month[month] = round(change, 2)
                else:
                    month_over_month[month] = None

        return {
            "monthly_totals": monthly_totals,
            "category_breakdown": category_breakdown,
            "month_over_month": month_over_month,
        }
