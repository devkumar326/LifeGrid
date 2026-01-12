"""SQLAlchemy engine + session management."""

from __future__ import annotations

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import DATABASE_URL

engine = create_engine(DATABASE_URL)
# If using Transaction Pooler or Session Pooler, we want to ensure we disable SQLAlchemy client side pooling -
# https://docs.sqlalchemy.org/en/20/core/pooling.html#switching-pool-implementations
# from sqlalchemy.pool import NullPool
# engine = create_engine(DATABASE_URL, poolclass=NullPool)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """
    FastAPI dependency that provides a database session.
    Ensures the session is closed after the request completes.
    """

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


