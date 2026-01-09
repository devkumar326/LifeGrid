# LifeGrid

## Project Overview

LifeGrid is a daily, hour-by-hour life logging tool.

It’s inspired by the clarity of spreadsheets, but built as a focused web app: a simple 24-hour grid, a few categories, and a place to write down what the day meant.

It’s designed for self-awareness, not productivity pressure.

## Core Philosophy

- **Reflection-first over analytics-first**: summaries exist to help you notice patterns, not to optimize you.
- **Manual logging as intentional friction**: choosing how to label an hour is part of the point.
- **No gamification**: no streaks, scores, leaderboards, or “perfect days”.

## Features

### V1 (MVP)

- **24-hour day grid**
- **Category-based logging per hour**
- **Color-coded categories**
- **View and edit past days**
- **Data persisted per date**

### V2 (Current)

**Daily Log improvements**

- **Explicit Unassigned hours** (neutral grey)
- **No default assumptions** (Sleep only when chosen)
- **Mobile-friendly interaction**

**Daily Summary**

- **Highlight of the day**
- **Free-text reflection**
- **Auto-derived metrics**
  - Tracked hours
  - Unassigned hours
  - Top categories

**Dashboard (read-only)**

- **Weekly overview**
- **Per-category hour distribution**
- **Average sleep over logged days**
- **Unassigned hours included for honesty**

**Notable Events**

- **Lightweight event logging**
- **Date-based grouping**
- **Optional details**
- **Designed to capture moments, not timelines**

## Screenshots

Placeholder: desktop and mobile screenshots will be added here.

## Tech Stack

- **Frontend**: Next.js (App Router), TypeScript
- **Backend**: FastAPI, PostgreSQL, SQLAlchemy
- **Styling**: CSS with a utility-first approach (small composable classes + CSS variables)
- **Deployment**: self-hosted / personal

## Local Development

### Backend

Prereqs: Python 3.11+, PostgreSQL 14+

```bash
createdb lifegrid
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
echo "DATABASE_URL=postgresql://localhost/lifegrid" > .env
uvicorn main:app --reload
```

Backend: `http://localhost:8000` (docs at `http://localhost:8000/docs`)

### Frontend

Prereqs: Node.js 18+

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:3000`

### Environment expectations

- **Backend** (`backend/.env`): `DATABASE_URL=postgresql://...`
- **Frontend** (optional `frontend/.env.local`): `NEXT_PUBLIC_API_URL=http://localhost:8000`

## Roadmap (short)

This is a personal roadmap, not a promise:

- **Mobile-first polish**
- **Monthly / yearly views**
- **Export (CSV / JSON)**
- **Offline-first support**

## License / Personal Use Note

MIT.

LifeGrid is built for personal use. If you fork it, please keep the spirit: calm, reflection-first, and not growth-optimized.

