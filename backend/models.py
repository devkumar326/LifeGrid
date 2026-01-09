"""
SQLAlchemy models for LifeGrid MVP.

Single table: day_logs
- Stores 24 hourly category codes for each date
- Uses PostgreSQL ARRAY type for the hours column

Note: If this column is being added to an existing database, run a manual
ALTER TABLE to add it (no Alembic here for the MVP):
  ALTER TABLE day_logs ADD COLUMN is_reconstructed BOOLEAN NOT NULL DEFAULT FALSE;
"""

import uuid
from sqlalchemy import Column, Date, ARRAY, SMALLINT, Boolean, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID

from database import Base


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


class NotableEvent(Base):
    """
    Lightweight memory log: notable events with optional category tag.
    """

    __tablename__ = "notable_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    date = Column(Date, nullable=False, index=True)
    title = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(SMALLINT, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

