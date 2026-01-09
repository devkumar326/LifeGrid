"""
Database configuration for LifeGrid MVP.

Uses SQLAlchemy with PostgreSQL. Connection string is read from environment
variable DATABASE_URL, with a sensible local default for development.
"""

from app.core.config import DATABASE_URL
from app.db.base import Base
from app.db.session import SessionLocal, engine, get_db

__all__ = ["DATABASE_URL", "Base", "engine", "SessionLocal", "get_db"]

