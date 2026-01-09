"""Dashboard endpoints."""

from __future__ import annotations

from datetime import date, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models import DayLog
from app.schemas import WeeklyDashboardResponse

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/weekly", response_model=WeeklyDashboardResponse)
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

    logs = db.query(DayLog).filter(DayLog.date >= start, DayLog.date <= end).all()
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


