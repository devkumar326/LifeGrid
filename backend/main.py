"""
LifeGrid backend entrypoint.

This file is intentionally tiny: it re-exports the FastAPI app from `app.main`
so your existing command keeps working:

  uvicorn main:app --reload
"""

from app.main import app  # noqa: F401

