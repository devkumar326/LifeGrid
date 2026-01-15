"""Weekly dashboard schemas."""

from __future__ import annotations

from datetime import date

from pydantic import BaseModel


class WeeklyDashboardDay(BaseModel):
    date: date
    has_log: bool
    counts: list[int]  # per-category hours (0..11)
    tracked_hours: int
    unassigned_hours: int


class CategoryTotal(BaseModel):
    """Total hours per category for the week."""
    category_id: int
    hours: int


class WeeklyInsights(BaseModel):
    """Computed insights for the week."""
    average_sleep_hours: float  # Average sleep per day (only logged days)
    most_frequent_category: int | None  # Category with most hours (excluding unassigned)
    most_balanced_day: date | None  # Day with lowest variance in hour distribution


class DreamMetrics(BaseModel):
    """Counts for dream logging in the last 7 days."""

    dream_days: int
    remembered_count: int
    unremembered_count: int


class WeeklyDashboardResponse(BaseModel):
    start_date: date
    end_date: date
    days: list[WeeklyDashboardDay]
    total_tracked_hours: int
    average_sleep_hours: float
    logged_days: int
    # V3 additions
    category_totals: list[CategoryTotal]  # Sorted descending by hours
    insights: WeeklyInsights
    dreams: DreamMetrics


