"""
Pydantic schemas for LifeGrid API validation.

Defines request/response shapes and validation rules.
"""

from datetime import date
from typing import List, Optional

from pydantic import BaseModel, field_validator


# Valid category codes (0-11) + explicit "unassigned" sentinel (-1)
UNASSIGNED_CATEGORY = -1
MIN_CATEGORY = 0
MAX_CATEGORY = 11
HOURS_IN_DAY = 24


class DayLogBase(BaseModel):
    """Base schema with hours array validation."""
    hours: List[Optional[int]]

    @field_validator("hours")
    @classmethod
    def validate_hours(cls, v: List[Optional[int]]) -> List[int]:
        """
        Validates:
        1. Exactly 24 hours
        2. Each value is a valid category code (0-11), OR explicit unassigned (-1), OR null
           (null is normalized to -1 for storage/consistency).
        """
        if len(v) != HOURS_IN_DAY:
            raise ValueError(f"hours must have exactly {HOURS_IN_DAY} elements")

        normalized: List[int] = []
        for i, hour_val in enumerate(v):
            if hour_val is None:
                normalized.append(UNASSIGNED_CATEGORY)
                continue

            if hour_val == UNASSIGNED_CATEGORY:
                normalized.append(hour_val)
                continue

            if not (MIN_CATEGORY <= hour_val <= MAX_CATEGORY):
                raise ValueError(
                    f"hour[{i}] value {hour_val} must be {UNASSIGNED_CATEGORY}, null, "
                    f"or between {MIN_CATEGORY} and {MAX_CATEGORY}"
                )

            normalized.append(hour_val)

        return normalized


class DayLogCreate(DayLogBase):
    """Schema for creating/updating a day log (request body)."""
    pass


class DayLogResponse(DayLogBase):
    """Schema for day log API responses."""
    id: str
    date: date
    is_reconstructed: bool

    class Config:
        from_attributes = True


class DailySummaryBase(BaseModel):
    """Daily reflection text fields (all numeric metrics are derived)."""

    highlight: Optional[str] = None
    reflection: Optional[str] = None


class DailySummaryCreate(DailySummaryBase):
    """Schema for creating/updating a daily summary (request body)."""

    pass


class DailySummaryResponse(DailySummaryBase):
    """Schema for daily summary API responses."""

    id: str
    date: date

    class Config:
        from_attributes = True


class NotableEventBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[int] = None


class NotableEventCreate(NotableEventBase):
    date: date


class NotableEventResponse(NotableEventBase):
    id: str
    date: date

    class Config:
        from_attributes = True


class WeeklyDashboardDay(BaseModel):
    date: date
    has_log: bool
    counts: List[int]  # per-category hours (0..11)
    tracked_hours: int
    unassigned_hours: int


class WeeklyDashboardResponse(BaseModel):
    start_date: date
    end_date: date
    days: List[WeeklyDashboardDay]
    total_tracked_hours: int
    average_sleep_hours: float
    logged_days: int

