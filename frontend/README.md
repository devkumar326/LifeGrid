# LifeGrid Frontend ⚛️

Next.js frontend for the LifeGrid hourly life-tracking application.

## Overview

A responsive web interface that displays a 24-hour grid for logging daily activities. Users click on hour blocks to cycle through 12 activity categories, then save their logs to the backend. Daily Summary includes a calm Dream section for optional reflection.

## Tech Stack

- **Next.js** 16 — React framework with App Router
- **React** 19 — UI library
- **TypeScript** 5 — Type safety
- **Tailwind CSS** 4 — Utility-first styling

## Setup

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### Configuration (Optional)

Create a `.env.local` file to customize the API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Default API URL is `http://localhost:8000` if not specified.

### Running the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Building for Production

```bash
# Create optimized build
npm run build

# Start production server
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx      # Root layout with fonts & metadata
│   ├── page.tsx        # Main page component (home)
│   ├── globals.css     # Global styles & CSS variables
│   └── favicon.ico     # App icon
├── components/
│   ├── Header.tsx      # App header with title
│   ├── DateSelector.tsx # Date picker with status indicator
│   ├── HourGrid.tsx    # 24-hour clickable grid
│   └── CategoryLegend.tsx # Color-coded category legend
├── lib/
│   ├── api.ts          # Backend API client functions
│   ├── categories.ts   # Category definitions & colors
│   └── date.ts         # Date utilities & helpers
├── types/
│   └── dayLog.ts       # TypeScript type definitions
└── public/
    └── lifegridIcn.png # App logo
```

## Components

### `HourGrid`

The main interactive component. Displays 24 hour blocks in a grid layout.

**Props:**
- `hours: number[]` — Array of 24 category codes
- `onHourClick: (index: number) => void` — Click handler
- `disabled: boolean` — Disables interaction (for future dates)
- `isReconstructedView: boolean` — Shows visual indicator for backfilled data

### `DateSelector`

Date input with visual status indicators.

**Props:**
- `dateString: string` — Current date in YYYY-MM-DD format
- `onDateChange: (value: string) => void` — Change handler
- `dateStatus: DateStatus` — 'past' | 'today' | 'yesterday' | 'future' | 'reconstructed'
- `loading: boolean` — Shows loading state

### `CategoryLegend`

Displays all 12 categories with their colors and icons.

## Dream Logging (3-State)

The Dream UI lives inside the Daily Summary panel:
- `components/DailySummary.tsx` renders the Dream selector and optional textarea
- `app/page.tsx` manages dream state, saving, and offline-tolerant behavior

**UX philosophy (optional):**
- Calm, non-intrusive, reflection-first
- No pressure to remember details
- No gamification or reminders

## PWA & Offline Behavior

- Installable PWA shell (service worker + manifest)
- Dream input works offline; changes are kept in the UI
- Saves are best-effort when connection returns (no background sync)

## Categories

Each hour can be assigned one of 12 categories:

| Code | Category | Color | Icon |
|------|----------|-------|------|
| 0 | Sleep | Deep Blue | 🌙 |
| 1 | Work | Blue | 💼 |
| 2 | Learning & Building | Green | 📘 |
| 3 | Deep Thinking / Reflection | Purple | 🧠 |
| 4 | Exercise & Health | Red | 🏋️ |
| 5 | Friends & Social | Orange | 🧑‍🤝‍🧑 |
| 6 | Relaxation & Leisure | Teal | 🎮 |
| 7 | Dating / Partner | Pink | ❤️ |
| 8 | Family | Yellow | 👪 |
| 9 | Life Admin / Chores | Gray | 🧾 |
| 10 | Travel / Commute | Cyan | ✈️ |
| 11 | Getting Ready / Misc | Brown | 🚿 |

## API Integration

The frontend communicates with the FastAPI backend via `lib/api.ts`:

```typescript
// Fetch a day's log
const log = await fetchDayLog('2026-01-04');

// Save a day's log
await saveDayLog('2026-01-04', hours);
```

**Default API Base URL:** `http://localhost:8000`

## Features

### Date Status Handling

The app determines the "status" of each date:
- **Today** — Full editing, real-time logging
- **Yesterday** — Full editing, within "live window"
- **Past** (older) — Editing allowed, flagged as "reconstructed"
- **Future** — Viewing only, editing disabled

### Unsaved Changes

The UI tracks unsaved changes and:
- Enables/disables the Save button accordingly
- Shows "Save Day" vs "Saved" state
- Prevents accidental data loss

### Error Handling

Graceful error handling when:
- Backend is offline
- Invalid date selected
- Network requests fail

## Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Styling

Uses Tailwind CSS with custom CSS variables defined in `globals.css`:

```css
:root {
  --accent: #...;
  --accent-hover: #...;
  /* Category colors */
  --cat-0: #...;  /* Sleep */
  --cat-1: #...;  /* Work */
  /* ... etc */
}
```

Category colors are applied via utility classes: `cat-0`, `cat-1`, ... `cat-11`

## TypeScript Types

```typescript
// types/dayLog.ts
export type DateStatus = 'past' | 'today' | 'yesterday' | 'future' | 'reconstructed';

export interface DayLogResponse {
  id: string;
  date: string;
  hours: number[];
  is_reconstructed: boolean;
}
```

## Browser Support

Modern browsers with ES2020+ support:
- Chrome 80+
- Firefox 75+
- Safari 14+
- Edge 80+
