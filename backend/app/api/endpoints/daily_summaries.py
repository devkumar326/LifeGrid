"""Daily summary endpoints."""

from __future__ import annotations

from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models import DailySummary
from app.schemas import DailySummaryCreate, DailySummaryResponse

router = APIRouter(prefix="/daily-summary", tags=["daily-summaries"])


@router.get("/{log_date}", response_model=DailySummaryResponse | None)
def get_daily_summary(log_date: date, db: Session = Depends(get_db)):
    """Get the daily summary for a specific date (returns null if none exists)."""

    summary = db.query(DailySummary).filter(DailySummary.date == log_date).first()
    if not summary:
        return None

    return DailySummaryResponse(
        id=str(summary.id),
        date=summary.date,
        highlight=summary.highlight,
        reflection=summary.reflection,
    )


@router.put("/{log_date}", response_model=DailySummaryResponse)
def upsert_daily_summary(
    log_date: date,
    payload: DailySummaryCreate,
    db: Session = Depends(get_db),
):
    """
    Create or update a daily summary for a specific date (upsert).

    - No metrics are stored here (those are derived from DayLog.hours)
    - Keeps single-user, low-friction semantics
    """

    today = date.today()

    if log_date > today:
        raise HTTPException(status_code=400, detail="Cannot write summary for future dates")

    existing = db.query(DailySummary).filter(DailySummary.date == log_date).first()

    if existing:
        existing.highlight = payload.highlight
        existing.reflection = payload.reflection
        db.commit()
        db.refresh(existing)
        return DailySummaryResponse(
            id=str(existing.id),
            date=existing.date,
            highlight=existing.highlight,
            reflection=existing.reflection,
        )

    new_summary = DailySummary(
        date=log_date,
        highlight=payload.highlight,
        reflection=payload.reflection,
    )
    db.add(new_summary)
    db.commit()
    db.refresh(new_summary)
    return DailySummaryResponse(
        id=str(new_summary.id),
        date=new_summary.date,
        highlight=new_summary.highlight,
        reflection=new_summary.reflection,
    )


