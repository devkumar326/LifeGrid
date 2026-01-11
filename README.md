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

### V2

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

### V3 (Current) ✨

**Weekly Overview Grid**

- **7-day mini stacked grids** (Monday → Sunday)
- **Visual time distribution** per day
- **Color-coded categories** with unassigned hours
- **Read-only reflection view**

**Insight Cards**

- **Average Sleep** (hours/day, logged days only)
- **Most Frequent Category** (excluding unassigned)
- **Most Balanced Day** (lowest variance in distribution)
- **No coaching or productivity advice**

**Category Distribution**

- **Donut chart visualization** of weekly time
- **Proportional view** with legend
- **Includes unassigned hours** for honesty
- **Fully responsive** (mobile + desktop)

**Enhanced Hour Grid**

- **Icon-only display** (cleaner, more visual)
- **Hover tooltips** (desktop) show category names
- **Long-press support** (mobile) via native tooltips
- **Unassigned hours** show time, no icon

**Mobile Timeline View**

- **Optional toggle** (Grid ↔ Timeline)
- **Vertical 24-hour list** with colored blocks
- **Category icons + names** displayed
- **Read-only** (switch to Grid to edit)
- **Mobile-only feature** (< 640px screens)

**Technical Improvements**

- **Server-side insights** computation
- **Variance calculation** for balanced day
- **Category totals** sorted by hours
- **Backward compatible** with V2 data
- **No breaking changes**

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

## Documentation

### V3 Guides
- **[V3_IMPLEMENTATION.md](V3_IMPLEMENTATION.md)** - Complete feature overview and technical details
- **[QUICKSTART_V3.md](QUICKSTART_V3.md)** - Setup and testing guide
- **[V3_ARCHITECTURE.md](V3_ARCHITECTURE.md)** - System architecture and data flow
- **[V3_VISUAL_GUIDE.md](V3_VISUAL_GUIDE.md)** - Visual feature guide with examples
- **[V3_COMPLETION_SUMMARY.md](V3_COMPLETION_SUMMARY.md)** - Implementation checklist and statistics

### Backend
- **[backend/README.md](backend/README.md)** - API documentation and database schema

## Roadmap (short)

This is a personal roadmap, not a promise:

- ✅ ~~Weekly visualization and insights~~ (V3 complete)
- ✅ ~~Mobile timeline view~~ (V3 complete)
- **Monthly / yearly views**
- **Export (CSV / JSON)**
- **Offline-first support**
- **Custom date range selection**

## License / Personal Use Note

MIT.

LifeGrid is built for personal use. If you fork it, please keep the spirit: calm, reflection-first, and not growth-optimized.

