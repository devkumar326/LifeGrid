"""Dream model."""

from __future__ import annotations

import uuid

from sqlalchemy import SMALLINT, Column, Date, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.db.base import Base


class Dream(Base):
    """
    Represents a single day's dream state (1:1 with date).

    dream_state:
    - 0 = No dream
    - 1 = Had a dream, not remembered
    - 2 = Remembered a dream (optional description)
    """

    __tablename__ = "dreams"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    date = Column(Date, unique=True, nullable=False, index=True)
    dream_state = Column(SMALLINT, nullable=False, default=0)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

