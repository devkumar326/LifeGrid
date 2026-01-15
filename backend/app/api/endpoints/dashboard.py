"""Dashboard endpoints."""

from __future__ import annotations

from datetime import date, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models import DayLog, Dream
from app.schemas import WeeklyDashboardResponse

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


def _calculate_variance(counts: list[int]) -> float:
    """
    Calculate variance of hour distribution across categories.
    Used to determine the most balanced day.
    """
    if not counts or sum(counts) == 0:
        return 0.0
    
    mean = sum(counts) / len(counts)
    variance = sum((x - mean) ** 2 for x in counts) / len(counts)
    return variance


@router.get("/weekly", response_model=WeeklyDashboardResponse)
def weekly_dashboard(db: Session = Depends(get_db)):
    """
    Weekly dashboard with insights (V3).

    - Last 7 days (inclusive, ending today)
    - Stacked hours per category (derived from DayLog.hours)
    - Average sleep hours (derived)
    - Total tracked hours this week (derived)
    - Category totals sorted by hours (descending)
    - Insights: most frequent category, most balanced day
    """

    CATEGORY_COUNT = 12  # 0..11
    UNASSIGNED = -1

    end = date.today()
    start = end - timedelta(days=6)

    logs = db.query(DayLog).filter(DayLog.date >= start, DayLog.date <= end).all()
    by_date = {l.date: l for l in logs}

    dream_records = (
        db.query(Dream).filter(Dream.date >= start, Dream.date <= end).all()
    )
    dream_days = 0
    remembered_count = 0
    unremembered_count = 0
    for dream in dream_records:
        if dream.dream_state == 2:
            remembered_count += 1
            dream_days += 1
        elif dream.dream_state == 1:
            unremembered_count += 1
            dream_days += 1

    total_tracked = 0
    total_sleep = 0
    logged_days = 0
    days_out = []
    
    # V3: Track category totals across the week
    category_totals = [0] * CATEGORY_COUNT
    
    # V3: Track most balanced day (lowest variance)
    most_balanced_day = None
    lowest_variance = float('inf')

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
            
            # V3: Accumulate category totals
            for cat_id, hours in enumerate(counts):
                category_totals[cat_id] += hours
            
            # V3: Calculate variance for balanced day insight
            # Only consider days with tracked hours (exclude unassigned)
            if tracked > 0:
                variance = _calculate_variance(counts)
                if variance < lowest_variance:
                    lowest_variance = variance
                    most_balanced_day = d

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
    
    # V3: Build category totals list, sorted descending by hours
    category_totals_list = [
        {"category_id": i, "hours": h} 
        for i, h in enumerate(category_totals) if h > 0
    ]
    category_totals_list.sort(key=lambda x: x["hours"], reverse=True)
    
    # V3: Find most frequent category (excluding sleep if you want variety)
    # Actually, let's include all categories for honesty
    most_frequent_category = None
    if category_totals_list:
        most_frequent_category = category_totals_list[0]["category_id"]

    return {
        "start_date": start,
        "end_date": end,
        "days": days_out,
        "total_tracked_hours": total_tracked,
        "average_sleep_hours": avg_sleep,
        "logged_days": logged_days,
        "category_totals": category_totals_list,
        "insights": {
            "average_sleep_hours": avg_sleep,
            "most_frequent_category": most_frequent_category,
            "most_balanced_day": most_balanced_day,
        },
        "dreams": {
            "dream_days": dream_days,
            "remembered_count": remembered_count,
            "unremembered_count": unremembered_count,
        },
    }


