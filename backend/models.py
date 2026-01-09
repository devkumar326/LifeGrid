"""
SQLAlchemy models for LifeGrid MVP.

This module is kept for backwards compatibility.
Models now live in `app.models.*`.
"""

from app.models import DailySummary, DayLog, NotableEvent

__all__ = ["DayLog", "DailySummary", "NotableEvent"]

