"""Top-level API router."""

from fastapi import APIRouter

from app.api.endpoints import (
    categories,
    daily_summaries,
    dashboard,
    day_logs,
    dreams,
    events,
    health,
)

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(day_logs.router)
api_router.include_router(categories.router)
api_router.include_router(daily_summaries.router)
api_router.include_router(dreams.router)
api_router.include_router(events.router)
api_router.include_router(dashboard.router)


