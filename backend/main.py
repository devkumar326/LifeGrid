"""
LifeGrid MVP - FastAPI Backend

A simple API for logging daily activities by hour.
Single user, no auth - just straightforward CRUD for day logs.
"""

from datetime import date, timedelta
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from uuid import UUID

from database import engine, get_db, Base
from models import DayLog, DailySummary, NotableEvent
from schemas import (
    DayLogCreate,
    DayLogResponse,
    DailySummaryCreate,
    DailySummaryResponse,
    NotableEventCreate,
    NotableEventResponse,
    WeeklyDashboardResponse,
)

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
    - each element must be 0-11, or -1 for Unassigned (null is also accepted and normalized)
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


@app.get("/daily-summary/{log_date}", response_model=DailySummaryResponse | None)
def get_daily_summary(log_date: date, db: Session = Depends(get_db)):
    """
    Get the daily summary for a specific date.

    Returns null if no summary exists for that date.
    """
    summary = db.query(DailySummary).filter(DailySummary.date == log_date).first()
    if not summary:
        return None

    return DailySummaryResponse(
        id=str(summary.id),
        date=summary.date,
        highlight=summary.highlight,
        reflection=summary.reflection,
    )


@app.put("/daily-summary/{log_date}", response_model=DailySummaryResponse)
def upsert_daily_summary(
    log_date: date,
    payload: DailySummaryCreate,
    db: Session = Depends(get_db),
):
    """
    Create or update a daily summary for a specific date.

    - No metrics are stored here (those are derived from DayLog.hours)
    - Keeps single-user, low-friction semantics (upsert)
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


@app.get("/events", response_model=list[NotableEventResponse])
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


@app.post("/events", response_model=NotableEventResponse)
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


@app.delete("/events/{event_id}")
def delete_event(event_id: UUID, db: Session = Depends(get_db)):
    """Delete a notable event (optional feature)."""
    ev = db.query(NotableEvent).filter(NotableEvent.id == event_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Event not found")

    db.delete(ev)
    db.commit()
    return {"status": "deleted"}


@app.get("/dashboard/weekly", response_model=WeeklyDashboardResponse)
def weekly_dashboard(db: Session = Depends(get_db)):
    """
    Minimal weekly dashboard (read-only).

    - Last 7 days (inclusive, ending today)
    - Stacked hours per category (derived from DayLog.hours)
    - Average sleep hours (derived)
    - Total tracked hours this week (derived)
    """
    CATEGORY_COUNT = 12  # 0..11
    UNASSIGNED = -1

    end = date.today()
    start = end - timedelta(days=6)

    logs = (
        db.query(DayLog)
        .filter(DayLog.date >= start, DayLog.date <= end)
        .all()
    )
    by_date = {l.date: l for l in logs}

    total_tracked = 0
    total_sleep = 0
    logged_days = 0
    days_out = []

    for i in range(7):
        d = start + timedelta(days=i)
        log = by_date.get(d)

        counts = [0] * CATEGORY_COUNT
        unassigned = 0
        tracked = 0
        has_log = False

        if log:
            has_log = True
            logged_days += 1
            for v in list(log.hours):
                if v == UNASSIGNED or v is None:
                    unassigned += 1
                elif 0 <= v < CATEGORY_COUNT:
                    counts[v] += 1
                    tracked += 1
                else:
                    # Unknown category codes are treated as unassigned for honesty.
                    unassigned += 1

            total_tracked += tracked
            total_sleep += counts[0]

        days_out.append(
            {
                "date": d,
                "has_log": has_log,
                "counts": counts,
                "tracked_hours": tracked,
                "unassigned_hours": unassigned,
            }
        )

    avg_sleep = (total_sleep / logged_days) if logged_days > 0 else 0.0

    return {
        "start_date": start,
        "end_date": end,
        "days": days_out,
        "total_tracked_hours": total_tracked,
        "average_sleep_hours": avg_sleep,
        "logged_days": logged_days,
    }

