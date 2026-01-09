"""Notable events endpoints."""

from __future__ import annotations

from datetime import date, timedelta
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models import NotableEvent
from app.schemas import NotableEventCreate, NotableEventResponse

router = APIRouter(tags=["events"])


@router.get("/events", response_model=list[NotableEventResponse])
def list_events(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    db: Session = Depends(get_db),
):
    """
    List notable events, optionally filtered by date range.

    If no range is provided, returns the last 30 days (inclusive).
    """

    if end_date is None:
        end_date = date.today()
    if start_date is None:
        start_date = end_date - timedelta(days=29)

    if start_date > end_date:
        raise HTTPException(status_code=400, detail="start_date must be <= end_date")

    events = (
        db.query(NotableEvent)
        .filter(NotableEvent.date >= start_date, NotableEvent.date <= end_date)
        .order_by(NotableEvent.date.desc(), NotableEvent.created_at.desc())
        .all()
    )

    return [
        NotableEventResponse(
            id=str(e.id),
            date=e.date,
            title=e.title,
            description=e.description,
            category=e.category,
        )
        for e in events
    ]


@router.post("/events", response_model=NotableEventResponse)
def create_event(payload: NotableEventCreate, db: Session = Depends(get_db)):
    """Create a notable event."""

    today = date.today()
    if payload.date > today:
        raise HTTPException(status_code=400, detail="Cannot create events for future dates")

    ev = NotableEvent(
        date=payload.date,
        title=payload.title.strip(),
        description=payload.description,
        category=payload.category,
    )
    db.add(ev)
    db.commit()
    db.refresh(ev)
    return NotableEventResponse(
        id=str(ev.id),
        date=ev.date,
        title=ev.title,
        description=ev.description,
        category=ev.category,
    )


@router.delete("/events/{event_id}")
def delete_event(event_id: UUID, db: Session = Depends(get_db)):
    """Delete a notable event (optional feature)."""

    ev = db.query(NotableEvent).filter(NotableEvent.id == event_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Event not found")

    db.delete(ev)
    db.commit()
    return {"status": "deleted"}


