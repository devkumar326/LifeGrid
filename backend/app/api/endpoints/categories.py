"""Category reference endpoints (frontend is source of truth)."""

from fastapi import APIRouter

router = APIRouter(tags=["categories"])

# Category reference (for documentation, actual logic is frontend)
CATEGORIES: dict[int, str] = {
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


@router.get("/categories")
def get_categories():
    """
    Returns the category enum for reference.
    Frontend has this hardcoded, but useful for debugging/docs.
    """

    return CATEGORIES


