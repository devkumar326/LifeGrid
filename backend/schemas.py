"""
Pydantic schemas for LifeGrid API validation.

Defines request/response shapes and validation rules.
"""

from datetime import date
from typing import List
from pydantic import BaseModel, field_validator


# Valid category codes (0-11)
MIN_CATEGORY = 0
MAX_CATEGORY = 11
HOURS_IN_DAY = 24


class DayLogBase(BaseModel):
    """Base schema with hours array validation."""
    hours: List[int]

    @field_validator("hours")
    @classmethod
    def validate_hours(cls, v: List[int]) -> List[int]:
        """
        Validates:
        1. Exactly 24 hours
        2. Each value is a valid category code (0-11)
        """
        if len(v) != HOURS_IN_DAY:
            raise ValueError(f"hours must have exactly {HOURS_IN_DAY} elements")
        
        for i, hour_val in enumerate(v):
            if not (MIN_CATEGORY <= hour_val <= MAX_CATEGORY):
                raise ValueError(
                    f"hour[{i}] value {hour_val} must be between "
                    f"{MIN_CATEGORY} and {MAX_CATEGORY}"
                )
        return v


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

