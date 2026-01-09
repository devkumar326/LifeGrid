"""DayLog model."""

from __future__ import annotations

import uuid

from sqlalchemy import ARRAY, SMALLINT, Boolean, Column, Date
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base


class DayLog(Base):
    """
    Represents a single day's hourly activity log.

    - id: UUID primary key (auto-generated)
    - date: Unique date for this log (one log per day)
    - hours: Array of 24 integers (0-11), one per hour of the day.
             V2: -1 is used as an explicit sentinel for "Unassigned".
    - is_reconstructed: Flags whether this log was backfilled (older than the live window)
    """

    __tablename__ = "day_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    date = Column(Date, unique=True, nullable=False, index=True)
    # PostgreSQL ARRAY of SMALLINT - stores 24 category codes
    hours = Column(ARRAY(SMALLINT), nullable=False)
    # True for logs older than the live window (today + yesterday)
    is_reconstructed = Column(Boolean, nullable=False, default=False)


