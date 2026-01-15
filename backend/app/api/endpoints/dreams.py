"""Dream endpoints."""

from __future__ import annotations

from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models import Dream
from app.schemas import DreamResponse, DreamState, DreamUpsert

router = APIRouter(prefix="/dreams", tags=["dreams"])


@router.get("/{log_date}", response_model=DreamResponse | None)
def get_dream(log_date: date, db: Session = Depends(get_db)):
    """Get the dream entry for a specific date (returns null if none exists)."""

    dream = db.query(Dream).filter(Dream.date == log_date).first()
    if not dream:
        return None

    return DreamResponse(
        id=str(dream.id),
        date=dream.date,
        dream_state=dream.dream_state,
        description=dream.description,
    )


@router.post("", response_model=DreamResponse)
def upsert_dream(payload: DreamUpsert, db: Session = Depends(get_db)):
    """
    Create or update a dream entry for a specific date (upsert).

    - Single entry per day
    - Description is optional and only used when remembered
    """

    today = date.today()

    if payload.date > today:
        raise HTTPException(status_code=400, detail="Cannot write dreams for future dates")

    existing = db.query(Dream).filter(Dream.date == payload.date).first()
    dream_state_value = int(payload.dream_state)
    description = None if payload.dream_state == DreamState.NONE else payload.description

    if existing:
        existing.dream_state = dream_state_value
        existing.description = description
        db.commit()
        db.refresh(existing)
        return DreamResponse(
            id=str(existing.id),
            date=existing.date,
            dream_state=existing.dream_state,
            description=existing.description,
        )

    new_dream = Dream(
        date=payload.date,
        dream_state=dream_state_value,
        description=description,
    )
    db.add(new_dream)
    db.commit()
    db.refresh(new_dream)
    return DreamResponse(
        id=str(new_dream.id),
        date=new_dream.date,
        dream_state=new_dream.dream_state,
        description=new_dream.description,
    )


@router.delete("/{log_date}")
def reset_dream(log_date: date, db: Session = Depends(get_db)):
    """Reset a day's dream entry back to 'No Dream'."""

    existing = db.query(Dream).filter(Dream.date == log_date).first()
    if not existing:
        return {"status": "no_record"}

    existing.dream_state = int(DreamState.NONE)
    existing.description = None
    db.commit()
    return {"status": "reset"}

