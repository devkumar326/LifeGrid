"""
Application configuration.

Best practice note:
- For a larger app, prefer `pydantic-settings` with typed settings.
- For this MVP, we keep a tiny env-driven config module.
"""

from __future__ import annotations

import os

from dotenv import load_dotenv

load_dotenv()


PROJECT_NAME = "LifeGrid API"
PROJECT_DESCRIPTION = "MVP API for hourly life tracking"
PROJECT_VERSION = "0.1.0"

# Sensible local default for development.
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://localhost/lifegrid")

# Comma-separated list, or "*" to allow all origins (MVP).
_cors_origins_raw = os.getenv("CORS_ORIGINS", "*").strip()
CORS_ALLOW_ORIGINS: list[str] = (
    ["*"]
    if _cors_origins_raw == "*"
    else [o.strip() for o in _cors_origins_raw.split(",") if o.strip()]
)


