# LifeGrid Backend 🐍

FastAPI backend for the LifeGrid hourly life-tracking application.

## Overview

A RESTful API that provides CRUD operations for daily hour logs. Each day is represented as an array of 24 integers (0-11), where each integer maps to an activity category.

## Tech Stack

- **FastAPI** 0.109 — Modern async Python web framework
- **SQLAlchemy** 2.0 — ORM with async support
- **PostgreSQL** — Primary database (uses ARRAY column type)
- **Pydantic** 2.5 — Data validation and serialization
- **Uvicorn** — ASGI server

## Setup

### Prerequisites

- Python 3.11+
- PostgreSQL 14+

### Installation

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Configuration

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/lifegrid
```

**Connection string formats:**
```
# Local with default user
DATABASE_URL=postgresql://localhost/lifegrid

# With credentials
DATABASE_URL=postgresql://user:password@localhost:5432/lifegrid

# Remote database
DATABASE_URL=postgresql://user:password@host.example.com:5432/lifegrid
```

### Database Setup

```bash
# Create the database
createdb lifegrid

# Tables are auto-created on first run via SQLAlchemy
# For production, consider using Alembic migrations
```

### Running the Server

```bash
# Development (with auto-reload)
uvicorn main:app --reload

# Production
uvicorn main:app --host 0.0.0.0 --port 8000
```

Server runs at: http://localhost:8000

## API Reference

### Health Check

```http
GET /
```

**Response:**
```json
{
  "status": "ok",
  "app": "LifeGrid"
}
```

### Get Day Log

```http
GET /day-log/{date}
```

**Parameters:**
- `date` (path) — Date in `YYYY-MM-DD` format

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "date": "2026-01-04",
  "hours": [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 6, 1, 1, 1, 1, 4, 6, 5, 5, 6, 6, 0],
  "is_reconstructed": false
}
```

**Response (200 - no data):**
```json
null
```

### Create/Update Day Log

```http
PUT /day-log/{date}
```

**Parameters:**
- `date` (path) — Date in `YYYY-MM-DD` format

**Request Body:**
```json
{
  "hours": [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 6, 1, 1, 1, 1, 4, 6, 5, 5, 6, 6, 0]
}
```

**Validation Rules:**
- `hours` must contain exactly 24 elements
- Each element must be an integer from 0-11

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "date": "2026-01-04",
  "hours": [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 6, 1, 1, 1, 1, 4, 6, 5, 5, 6, 6, 0],
  "is_reconstructed": false
}
```

**Error (400 - Future Date):**
```json
{
  "detail": "Cannot log future dates"
}
```

### Get Categories

```http
GET /categories
```

**Response:**
```json
{
  "0": "Sleep",
  "1": "Work",
  "2": "Learning & Building",
  "3": "Deep Thinking / Reflection",
  "4": "Exercise & Health",
  "5": "Friends & Social",
  "6": "Relaxation & Leisure",
  "7": "Dating / Partner",
  "8": "Family",
  "9": "Life Admin / Chores",
  "10": "Travel / Commute",
  "11": "Getting Ready / Misc"
}
```

## Project Structure

```
backend/
├── main.py           # Entry-point shim (re-exports `app` from app/main.py)
├── app/              # Application package (best-practice structure)
│   ├── main.py       # FastAPI app composition (CORS, routers, lifespan)
│   ├── api/          # Routers + endpoint modules
│   ├── core/         # Config/constants
│   ├── db/           # SQLAlchemy engine/session/Base
│   ├── models/       # ORM models (split by domain)
│   └── schemas/      # Pydantic schemas (split by domain)
├── models.py         # Back-compat shim (re-exports from app/models)
├── schemas.py        # Back-compat shim (re-exports from app/schemas)
├── database.py       # Back-compat shim (re-exports from app/db + config)
├── requirements.txt  # Python dependencies
└── venv/             # Virtual environment (gitignored)
```

## Database Schema

### `day_logs` Table

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | Primary Key, auto-generated |
| `date` | DATE | Unique, Not Null, Indexed |
| `hours` | SMALLINT[] | Not Null (array of 24 integers) |
| `is_reconstructed` | BOOLEAN | Not Null, Default: false |

## Key Concepts

### Reconstructed Logs

Logs are flagged as "reconstructed" when they're created or updated for dates older than the "live window" (today and yesterday). This helps distinguish real-time logging from historical backfilling.

### Upsert Semantics

The `PUT /day-log/{date}` endpoint uses upsert logic:
- If a log exists for the date → update it
- If no log exists → create a new one

This simplifies the frontend by not requiring separate create/update calls.

## Interactive Docs

When the server is running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## Development Tips

```bash
# Check if server is running
curl http://localhost:8000/

# Test creating a log
curl -X PUT http://localhost:8000/day-log/2026-01-04 \
  -H "Content-Type: application/json" \
  -d '{"hours": [0,0,0,0,0,0,0,1,1,1,1,2,6,1,1,1,1,4,6,5,5,6,6,0]}'

# Fetch the log
curl http://localhost:8000/day-log/2026-01-04
```

## Dependencies

```
fastapi==0.109.0
uvicorn[standard]==0.27.0
sqlalchemy==2.0.25
psycopg2-binary==2.9.9
pydantic==2.5.3
python-dotenv==1.0.0
```

