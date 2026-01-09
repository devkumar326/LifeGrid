"""Healthcheck endpoints."""

from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/")
def root():
    """Health check endpoint."""

    return {"status": "ok", "app": "LifeGrid"}


