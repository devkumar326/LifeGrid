"""Dream schemas."""

from __future__ import annotations

from datetime import date
from enum import IntEnum
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class DreamState(IntEnum):
    NONE = 0
    UNREMEMBERED = 1
    REMEMBERED = 2


class DreamBase(BaseModel):
    """Dream state and optional description."""

    dream_state: DreamState = Field(default=DreamState.NONE)
    description: Optional[str] = None


class DreamUpsert(DreamBase):
    """Schema for creating/updating a dream entry (upsert by date)."""

    date: date


class DreamResponse(DreamBase):
    """Schema for dream API responses."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    date: date

