"""NotableEvent model."""

from __future__ import annotations

import uuid

from sqlalchemy import Column, Date, DateTime, SMALLINT, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.db.base import Base


class NotableEvent(Base):
    """Lightweight memory log: notable events with optional category tag."""

    __tablename__ = "notable_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    date = Column(Date, nullable=False, index=True)
    title = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(SMALLINT, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())


