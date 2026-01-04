# LifeGrid 🗓️

**Track how you spend every hour of your life.**

LifeGrid is an hourly life-tracking application that helps you visualize and log how you spend each hour of every day across 12 meaningful categories.

![LifeGrid](frontend/public/lifegridIcn.png)

## Overview

LifeGrid lets you:
- **Log activities by hour** — Click through a 24-hour grid to categorize each hour of your day
- **Track across 12 categories** — Sleep, Work, Learning, Exercise, Social, and more
- **Review past days** — Navigate to any date and see (or edit) how you spent your time
- **Identify patterns** — Visual color-coding makes it easy to spot habits and time allocation

## Categories

| Code | Category | Icon |
|------|----------|------|
| 0 | Sleep | 🌙 |
| 1 | Work | 💼 |
| 2 | Learning & Building | 📘 |
| 3 | Deep Thinking / Reflection | 🧠 |
| 4 | Exercise & Health | 🏋️ |
| 5 | Friends & Social | 🧑‍🤝‍🧑 |
| 6 | Relaxation & Leisure | 🎮 |
| 7 | Dating / Partner | ❤️ |
| 8 | Family | 👪 |
| 9 | Life Admin / Chores | 🧾 |
| 10 | Travel / Commute | ✈️ |
| 11 | Getting Ready / Misc | 🚿 |

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| **Backend** | FastAPI, Python 3.11+, SQLAlchemy 2.0 |
| **Database** | PostgreSQL |

## Project Structure

```
LifeGrid/
├── frontend/          # Next.js frontend application
│   ├── app/           # App router pages & layouts
│   ├── components/    # React components
│   ├── lib/           # Utilities, API client, helpers
│   └── types/         # TypeScript type definitions
├── backend/           # FastAPI backend API
│   ├── main.py        # API routes & app config
│   ├── models.py      # SQLAlchemy ORM models
│   ├── schemas.py     # Pydantic validation schemas
│   └── database.py    # Database connection setup
└── README.md          # You are here
```

## Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- **PostgreSQL** 14+

### 1. Clone & Setup Database

```bash
# Create PostgreSQL database
createdb lifegrid

# Or via psql
psql -c "CREATE DATABASE lifegrid;"
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
echo "DATABASE_URL=postgresql://localhost/lifegrid" > .env

# Run the server
uvicorn main:app --reload
```

Backend runs at: http://localhost:8000

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend runs at: http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/day-log/{date}` | Get log for a specific date |
| `PUT` | `/day-log/{date}` | Create or update a day's log |
| `GET` | `/categories` | List all category definitions |

**Date format:** `YYYY-MM-DD`

See detailed API documentation at http://localhost:8000/docs when the backend is running.

## Development

### Running Both Services

Open two terminals:

```bash
# Terminal 1 - Backend
cd backend && source venv/bin/activate && uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Environment Variables

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql://user:password@localhost:5432/lifegrid
```

**Frontend** (optional `frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Features

- ✅ 24-hour interactive grid
- ✅ 12 activity categories with color coding
- ✅ Date navigation (past, today)
- ✅ Auto-save with unsaved changes indicator
- ✅ Reconstructed entries flagged for historical logging
- ✅ Future date protection (can't log future days)
- ✅ Responsive design

## License

MIT

---

**Built with ☕ and curiosity about where time goes.**

