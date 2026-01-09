"""Day log endpoints."""

from __future__ import annotations

from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models import DayLog
from app.schemas import DayLogCreate, DayLogResponse

router = APIRouter(prefix="/day-log", tags=["day-logs"])


@router.get("/{log_date}", response_model=DayLogResponse | None)
def get_day_log(log_date: date, db: Session = Depends(get_db)):
    """
    Get the day log for a specific date.

    Returns null if no log exists for that date.
    Frontend should treat null as "no data yet" and show empty/default state.
    """

    day_log = db.query(DayLog).filter(DayLog.date == log_date).first()

    if not day_log:
        return None

    return DayLogResponse(
        id=str(day_log.id),
        date=day_log.date,
        hours=list(day_log.hours),
        is_reconstructed=day_log.is_reconstructed,
    )


@router.put("/{log_date}", response_model=DayLogResponse)
def upsert_day_log(
    log_date: date,
    payload: DayLogCreate,
    db: Session = Depends(get_db),
):
    """
    Create or update a day log for a specific date.

    Uses upsert semantics:
    - If log exists for date, update hours
    - If no log exists, create new one
    """

    today = date.today()

    # Future dates are not allowed (MVP assumes server/local timezone match)
    if log_date > today:
        raise HTTPException(status_code=400, detail="Cannot log future dates")

    # Live window = today + yesterday. Anything older is reconstructed.
    is_reconstructed = log_date < (today - timedelta(days=1))

    existing = db.query(DayLog).filter(DayLog.date == log_date).first()

    if existing:
        # Update existing log
        existing.hours = payload.hours
        # Keep reconstruction flag in sync with date status
        existing.is_reconstructed = is_reconstructed
        db.commit()
        db.refresh(existing)
        return DayLogResponse(
            id=str(existing.id),
            date=existing.date,
            hours=list(existing.hours),
            is_reconstructed=existing.is_reconstructed,
        )

    # Create new log
    new_log = DayLog(date=log_date, hours=payload.hours, is_reconstructed=is_reconstructed)
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return DayLogResponse(
        id=str(new_log.id),
        date=new_log.date,
        hours=list(new_log.hours),
        is_reconstructed=new_log.is_reconstructed,
    )


