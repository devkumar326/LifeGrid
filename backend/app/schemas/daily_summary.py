"""Daily summary schemas."""

from __future__ import annotations

from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict


class DailySummaryBase(BaseModel):
    """Daily reflection text fields (all numeric metrics are derived)."""

    highlight: Optional[str] = None
    reflection: Optional[str] = None


class DailySummaryCreate(DailySummaryBase):
    """Schema for creating/updating a daily summary (request body)."""


class DailySummaryResponse(DailySummaryBase):
    """Schema for daily summary API responses."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    date: date


