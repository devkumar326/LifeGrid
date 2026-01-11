# LifeGrid V3 - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Main Page  │  │  Dashboard   │  │    Events    │         │
│  │   (Logging)  │  │   (V3 New)   │  │     Page     │         │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘         │
│         │                  │                                     │
│  ┌──────▼──────────────────▼────────────────────────┐          │
│  │              Component Layer                      │          │
│  ├──────────────────────────────────────────────────┤          │
│  │  V2 Components:                                   │          │
│  │  • HourGrid (✨ Enhanced)                        │          │
│  │  • DateSelector                                   │          │
│  │  • DailySummary                                   │          │
│  │  • CategoryLegend                                 │          │
│  │  • Header                                         │          │
│  ├──────────────────────────────────────────────────┤          │
│  │  V3 Components (NEW):                             │          │
│  │  • WeeklyGrid         (7-day stacked grids)      │          │
│  │  • InsightCards       (3 computed insights)      │          │
│  │  • CategoryDonut      (pie chart visualization)  │          │
│  │  • MobileTimeline     (mobile vertical view)     │          │
│  └──────────────────────────────────────────────────┘          │
│         │                                                        │
│  ┌──────▼──────────────────────────────────────────┐          │
│  │              API Client Layer                     │          │
│  │  • fetchWeeklyDashboard()                        │          │
│  │  • fetchDayLog()                                 │          │
│  │  • saveDayLog()                                  │          │
│  │  • fetchDailySummary()                           │          │
│  └──────────────────────────────────────────────────┘          │
│         │                                                        │
└─────────┼────────────────────────────────────────────────────────┘
          │
          │ HTTP/JSON
          │
┌─────────▼────────────────────────────────────────────────────────┐
│                      BACKEND (FastAPI)                            │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────┐         │
│  │                 API Endpoints                       │         │
│  ├────────────────────────────────────────────────────┤         │
│  │  • GET  /dashboard/weekly  (✨ Enhanced V3)       │         │
│  │  • GET  /day-log/{date}                            │         │
│  │  • PUT  /day-log/{date}                            │         │
│  │  • GET  /daily-summaries/{date}                    │         │
│  │  • PUT  /daily-summaries/{date}                    │         │
│  │  • GET  /events                                     │         │
│  │  • POST /events                                     │         │
│  │  • GET  /categories                                 │         │
│  └────────────────────────────────────────────────────┘         │
│         │                                                         │
│  ┌──────▼──────────────────────────────────────────┐           │
│  │           Business Logic Layer                   │           │
│  ├──────────────────────────────────────────────────┤           │
│  │  V3 Computations:                                │           │
│  │  • _calculate_variance()                         │           │
│  │  • Category totals aggregation                   │           │
│  │  • Most frequent category                        │           │
│  │  • Most balanced day (lowest variance)           │           │
│  │  • Average sleep (logged days only)              │           │
│  └──────────────────────────────────────────────────┘           │
│         │                                                         │
│  ┌──────▼──────────────────────────────────────────┐           │
│  │              ORM Layer (SQLAlchemy)              │           │
│  │  • DayLog                                        │           │
│  │  • DailySummary                                  │           │
│  │  • NotableEvent                                  │           │
│  └──────────────────────────────────────────────────┘           │
│         │                                                         │
└─────────┼─────────────────────────────────────────────────────────┘
          │
          │ SQL
          │
┌─────────▼─────────────────────────────────────────────────────────┐
│                     DATABASE (PostgreSQL)                          │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────────────────────────────┐            │
│  │  day_logs                                         │            │
│  ├──────────────────────────────────────────────────┤            │
│  │  • id (UUID, PK)                                 │            │
│  │  • date (DATE, UNIQUE)                           │            │
│  │  • hours (SMALLINT[], 24 elements)               │            │
│  │  • is_reconstructed (BOOLEAN)                    │            │
│  └──────────────────────────────────────────────────┘            │
│                                                                    │
│  ┌──────────────────────────────────────────────────┐            │
│  │  daily_summaries                                  │            │
│  ├──────────────────────────────────────────────────┤            │
│  │  • id (UUID, PK)                                 │            │
│  │  • date (DATE, UNIQUE)                           │            │
│  │  • highlight (TEXT)                              │            │
│  │  • reflection (TEXT)                             │            │
│  └──────────────────────────────────────────────────┘            │
│                                                                    │
│  ┌──────────────────────────────────────────────────┐            │
│  │  notable_events                                   │            │
│  ├──────────────────────────────────────────────────┤            │
│  │  • id (UUID, PK)                                 │            │
│  │  • date (DATE)                                   │            │
│  │  • title (TEXT)                                  │            │
│  │  • description (TEXT)                            │            │
│  │  • created_at (TIMESTAMP)                        │            │
│  └──────────────────────────────────────────────────┘            │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow - V3 Weekly Dashboard

```
┌──────────────┐
│   Browser    │
│  /dashboard  │
└──────┬───────┘
       │
       │ 1. User visits /dashboard
       │
       ▼
┌──────────────────────────────────────┐
│  DashboardPage Component             │
│  • useEffect() on mount              │
│  • calls fetchWeeklyDashboard()      │
└──────┬───────────────────────────────┘
       │
       │ 2. GET /dashboard/weekly
       │
       ▼
┌──────────────────────────────────────┐
│  Backend: weekly_dashboard()         │
│  • Query last 7 days from DB         │
│  • Calculate category totals         │
│  • Compute insights:                 │
│    - Average sleep                   │
│    - Most frequent category          │
│    - Most balanced day (variance)    │
└──────┬───────────────────────────────┘
       │
       │ 3. Return JSON response
       │
       ▼
┌──────────────────────────────────────┐
│  Frontend: setData(response)         │
│  • Renders WeeklyGrid                │
│  • Renders InsightCards              │
│  • Renders CategoryDonut             │
│  • Renders CategoryTotals            │
└──────────────────────────────────────┘
```

---

## Component Hierarchy - Dashboard Page

```
DashboardPage
├── Header
├── Link (Back to Log)
├── WeeklyGrid
│   └── 7 × DayColumn
│       └── 24 × HourBlock (stacked)
├── InsightCards
│   ├── AverageSleepCard
│   ├── MostFrequentCard
│   └── MostBalancedDayCard
├── CategoryDonut
│   ├── SVG Donut Chart
│   └── Legend
│       └── N × CategoryLegendItem
└── CategoryTotals
    └── N × CategoryRow
```

---

## Component Hierarchy - Main Logging Page

```
HomePage
├── Header
├── DateSelector
├── SaveButton
├── [Mobile Only] ViewToggle (Grid | Timeline)
├── Conditional Render:
│   ├── HourGrid (if Grid view or Desktop)
│   │   └── 24 × HourButton
│   │       ├── CategoryIcon
│   │       ├── HourIndexOverlay
│   │       └── [Desktop] HoverTooltip
│   └── MobileTimeline (if Timeline view and Mobile)
│       └── 24 × TimelineRow
│           ├── TimeLabel
│           └── CategoryBlock
├── DailySummary
│   ├── HighlightInput
│   └── ReflectionTextarea
└── CategoryLegend
    └── 12 × CategoryItem
```

---

## V3 Insight Calculations

### 1. Average Sleep
```python
total_sleep = sum(day.counts[0] for day in days if day.has_log)
logged_days = count(days where has_log == True)
average_sleep = total_sleep / logged_days if logged_days > 0 else 0.0
```

### 2. Most Frequent Category
```python
category_totals = [0] * 12
for day in days:
    for cat_id, hours in enumerate(day.counts):
        category_totals[cat_id] += hours

most_frequent = argmax(category_totals)  # Category with most hours
```

### 3. Most Balanced Day
```python
def calculate_variance(counts):
    mean = sum(counts) / len(counts)
    variance = sum((x - mean)² for x in counts) / len(counts)
    return variance

balanced_day = min(days, key=lambda d: calculate_variance(d.counts))
```

**Intuition:** Lower variance = more evenly distributed hours across categories

---

## Color Mapping

```typescript
// CSS Variables (globals.css)
--cat-0: #000000   // Sleep
--cat-1: #7b3f00   // Work
--cat-2: #ff8c00   // Learning
--cat-3: #ffc107   // Deep Thinking
--cat-4: #2e7d32   // Exercise
--cat-5: #81d4fa   // Friends
--cat-6: #1e3a8a   // Relaxation
--cat-7: #c084fc   // Dating
--cat-8: #6a1b9a   // Family
--cat-9: #1b5e20   // Life Admin
--cat-10: #6d4c41  // Travel
--cat-11: #d2b48c  // Getting Ready
--cat-unassigned: #3f3f46  // Unassigned

// Applied via classes
.cat-0 { background-color: var(--cat-0); }
.cat-1 { background-color: var(--cat-1); }
// ... etc
```

---

## Mobile Responsiveness

### Breakpoints
- **Mobile:** < 640px
  - Timeline toggle visible
  - Donut chart stacks vertically
  - Grid: 3 columns
  
- **Tablet:** 640px - 768px
  - Grid: 6 columns
  - Side-by-side layouts
  
- **Desktop:** > 768px
  - Grid: 8 columns
  - Hover tooltips active
  - Optimal spacing

### Mobile-Specific Features
1. **Timeline View Toggle**
   - Only visible on mobile (< 640px)
   - Default: Grid view
   - Timeline: Read-only vertical list

2. **Touch Interactions**
   - `touch-manipulation` CSS
   - Active scale feedback
   - Long-press via native `title` attribute

---

## API Response Schema - V3

### GET /dashboard/weekly

```typescript
{
  start_date: "2026-01-05",
  end_date: "2026-01-11",
  days: [
    {
      date: "2026-01-05",
      has_log: true,
      counts: [7, 8, 2, 1, 1, 2, 3, 0, 0, 0, 0, 0],
      tracked_hours: 24,
      unassigned_hours: 0
    },
    // ... 6 more days
  ],
  total_tracked_hours: 168,
  average_sleep_hours: 7.5,
  logged_days: 7,
  
  // V3 Additions
  category_totals: [
    { category_id: 0, hours: 52 },
    { category_id: 1, hours: 40 },
    { category_id: 2, hours: 20 },
    // ... sorted descending
  ],
  insights: {
    average_sleep_hours: 7.5,
    most_frequent_category: 0,
    most_balanced_day: "2026-01-08"
  }
}
```

---

## File Organization

```
LifeGrid/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/
│   │   │   │   ├── dashboard.py        ✨ V3 Enhanced
│   │   │   │   ├── day_logs.py
│   │   │   │   ├── daily_summaries.py
│   │   │   │   ├── events.py
│   │   │   │   └── categories.py
│   │   │   └── router.py
│   │   ├── core/
│   │   │   └── config.py
│   │   ├── db/
│   │   │   ├── base.py
│   │   │   └── session.py
│   │   ├── models/
│   │   │   ├── day_log.py
│   │   │   ├── daily_summary.py
│   │   │   └── notable_event.py
│   │   ├── schemas/
│   │   │   ├── day_log.py
│   │   │   ├── daily_summary.py
│   │   │   ├── notable_event.py
│   │   │   └── weekly_dashboard.py    ✨ V3 Enhanced
│   │   └── main.py
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py                     ✨ V3 Updated
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx               ✨ V3 Rebuilt
│   │   ├── events/
│   │   │   └── page.tsx
│   │   ├── page.tsx                   ✨ V3 Enhanced
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── WeeklyGrid.tsx             ✅ NEW
│   │   ├── InsightCards.tsx           ✅ NEW
│   │   ├── CategoryDonut.tsx          ✅ NEW
│   │   ├── MobileTimeline.tsx         ✅ NEW
│   │   ├── HourGrid.tsx               ✨ V3 Enhanced
│   │   ├── DateSelector.tsx
│   │   ├── DailySummary.tsx
│   │   ├── CategoryLegend.tsx
│   │   └── Header.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── categories.ts
│   │   └── date.ts
│   ├── types/
│   │   ├── dashboard.ts               ✨ V3 Enhanced
│   │   ├── dayLog.ts
│   │   ├── dailySummary.ts
│   │   └── events.ts
│   └── package.json
│
├── V3_IMPLEMENTATION.md               ✅ NEW
├── QUICKSTART_V3.md                   ✅ NEW
├── V3_ARCHITECTURE.md                 ✅ NEW (this file)
└── README.md
```

---

## Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** React Hooks (useState, useEffect, useMemo)
- **HTTP:** Fetch API

### Backend
- **Framework:** FastAPI 0.109
- **Language:** Python 3.11+
- **ORM:** SQLAlchemy 2.0
- **Validation:** Pydantic 2.5
- **Server:** Uvicorn

### Database
- **RDBMS:** PostgreSQL 14+
- **Array Support:** SMALLINT[] for 24-hour logs

---

## Design Principles

1. **Honesty First**
   - Unassigned hours prominently displayed
   - No hiding incomplete data
   - Variance shows real distribution

2. **Calm Reflection**
   - No gamification
   - No pressure or goals
   - Insights without judgment

3. **Mobile-First**
   - Touch-friendly interactions
   - Responsive layouts
   - Optional timeline view

4. **Performance**
   - Server-side computations
   - Memoized calculations
   - Efficient SQL queries

5. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Focus states
   - Semantic HTML

---

## Future Extensibility

While not in V3 scope, the architecture supports:

- **Export functionality:** Add endpoint returning CSV/JSON
- **Custom date ranges:** Extend dashboard to accept start/end params
- **Category customization:** Add user preferences table
- **Multi-user support:** Add authentication + user_id foreign keys
- **Analytics:** Add more computed insights
- **Themes:** Extend CSS variables for light mode

---

**Architecture Version:** V3  
**Last Updated:** January 11, 2026

