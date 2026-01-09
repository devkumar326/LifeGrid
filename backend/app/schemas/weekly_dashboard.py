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


class WeeklyDashboardResponse(BaseModel):
    start_date: date
    end_date: date
    days: list[WeeklyDashboardDay]
    total_tracked_hours: int
    average_sleep_hours: float
    logged_days: int


