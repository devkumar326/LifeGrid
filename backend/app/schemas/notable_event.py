"""Notable event schemas."""

from __future__ import annotations

from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict


class NotableEventBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[int] = None


class NotableEventCreate(NotableEventBase):
    date: date


class NotableEventResponse(NotableEventBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    date: date


