"""FastAPI application factory / composition root."""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import (
    CORS_ALLOW_ORIGINS,
    PROJECT_DESCRIPTION,
    PROJECT_NAME,
    PROJECT_VERSION,
)
from app.db.base import Base
from app.db.session import engine


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Ensure all model modules are imported so SQLAlchemy registers tables.
    # In production, you'd use Alembic migrations instead of create_all.
    import app.models  # noqa: F401

    # Test database connection on startup
    try:
        with engine.connect() as connection:
            print("✅ Database connection successful!")
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created/verified!")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        print(f"📝 Check your DATABASE_URL in .env file")
        raise
    
    yield


app = FastAPI(
    title=PROJECT_NAME,
    description=PROJECT_DESCRIPTION,
    version=PROJECT_VERSION,
    lifespan=lifespan,
)

# CORS: Allow frontend to call API
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOW_ORIGINS,  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


