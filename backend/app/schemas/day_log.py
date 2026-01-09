"""Day log schemas."""

from __future__ import annotations

from typing import Optional
from datetime import date

from pydantic import BaseModel, ConfigDict, field_validator

# Valid category codes (0-11) + explicit "unassigned" sentinel (-1)
UNASSIGNED_CATEGORY = -1
MIN_CATEGORY = 0
MAX_CATEGORY = 11
HOURS_IN_DAY = 24


class DayLogBase(BaseModel):
    """Base schema with hours array validation."""

    hours: list[Optional[int]]

    @field_validator("hours")
    @classmethod
    def validate_hours(cls, v: list[Optional[int]]) -> list[int]:
        """
        Validates:
        1. Exactly 24 hours
        2. Each value is a valid category code (0-11), OR explicit unassigned (-1), OR null
           (null is normalized to -1 for storage/consistency).
        """

        if len(v) != HOURS_IN_DAY:
            raise ValueError(f"hours must have exactly {HOURS_IN_DAY} elements")

        normalized: list[int] = []
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


class DayLogResponse(DayLogBase):
    """Schema for day log API responses."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    date: date
    is_reconstructed: bool


