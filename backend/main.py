"""
LifeGrid MVP - FastAPI Backend

A simple API for logging daily activities by hour.
Single user, no auth - just straightforward CRUD for day logs.
"""

from datetime import date, timedelta
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import DayLog
from schemas import DayLogCreate, DayLogResponse

# Create database tables on startup
# In production, you'd use Alembic migrations instead
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LifeGrid API",
    description="MVP API for hourly life tracking",
    version="0.1.0"
)

# CORS: Allow frontend to call API
# In MVP, we allow all origins for simplicity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    """Health check endpoint."""
    return {"status": "ok", "app": "LifeGrid"}


@app.get("/day-log/{log_date}", response_model=DayLogResponse | None)
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


@app.put("/day-log/{log_date}", response_model=DayLogResponse)
def upsert_day_log(
    log_date: date,
    payload: DayLogCreate,
    db: Session = Depends(get_db)
):
    """
    Create or update a day log for a specific date.
    
    Uses upsert semantics:
    - If log exists for date, update hours
    - If no log exists, create new one
    
    Validation (handled by Pydantic schema):
    - hours must have exactly 24 elements
    - each element must be 0-11
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
    else:
        # Create new log
        new_log = DayLog(
            date=log_date,
            hours=payload.hours,
            is_reconstructed=is_reconstructed
        )
        db.add(new_log)
        db.commit()
        db.refresh(new_log)
        return DayLogResponse(
            id=str(new_log.id),
            date=new_log.date,
            hours=list(new_log.hours),
            is_reconstructed=new_log.is_reconstructed,
        )


# Category reference (for documentation, actual logic is frontend)
CATEGORIES = {
    0: "Sleep",
    1: "Work",
    2: "Learning & Building",
    3: "Deep Thinking / Reflection",
    4: "Exercise & Health",
    5: "Friends & Social",
    6: "Relaxation & Leisure",
    7: "Dating / Partner",
    8: "Family",
    9: "Life Admin / Chores",
    10: "Travel / Commute",
    11: "Getting Ready / Misc",
}


@app.get("/categories")
def get_categories():
    """
    Returns the category enum for reference.
    Frontend has this hardcoded, but useful for debugging/docs.
    """
    return CATEGORIES

