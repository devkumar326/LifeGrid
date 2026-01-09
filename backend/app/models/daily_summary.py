"""DailySummary model."""

from __future__ import annotations

import uuid

from sqlalchemy import Column, Date, Text
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base


class DailySummary(Base):
    """
    Optional, reflection-first daily summary for a given date (1:1 with date).

    Stores only freeform text fields; all metrics are derived from DayLog.hours.
    """

    __tablename__ = "daily_summaries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    date = Column(Date, unique=True, nullable=False, index=True)
    highlight = Column(Text, nullable=True)
    reflection = Column(Text, nullable=True)


