"""
Pydantic schemas for LifeGrid API validation.

Defines request/response shapes and validation rules.

This module is kept for backwards compatibility.
Schemas now live in `app.schemas.*`.
"""

from app.schemas import (
    CategoryTotal,
    DailySummaryCreate,
    DailySummaryResponse,
    DayLogCreate,
    DayLogResponse,
    NotableEventCreate,
    NotableEventResponse,
    WeeklyDashboardDay,
    WeeklyDashboardResponse,
    WeeklyInsights,
)

__all__ = [
    "DayLogCreate",
    "DayLogResponse",
    "DailySummaryCreate",
    "DailySummaryResponse",
    "NotableEventCreate",
    "NotableEventResponse",
    "WeeklyDashboardDay",
    "WeeklyDashboardResponse",
    "CategoryTotal",
    "WeeklyInsights",
]

