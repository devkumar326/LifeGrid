# LifeGrid V3 - Visual Feature Guide

## 🎨 What You'll See

This guide shows what each V3 feature looks like and how to use it.

---

## 1. Weekly Overview Grid

**Location:** `/dashboard`

```
┌─────────────────────────────────────────────────────────────┐
│  Weekly Overview                                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Mon    Tue    Wed    Thu    Fri    Sat    Sun            │
│    5      6      7      8      9     10     11             │
│  ┌───┐  ┌───┐  ┌───┐  ┌───┐  ┌───┐  ┌───┐  ┌───┐         │
│  │███│  │███│  │███│  │███│  │███│  │░░░│  │░░░│         │
│  │███│  │███│  │███│  │███│  │███│  │░░░│  │░░░│         │
│  │▓▓▓│  │▓▓▓│  │▓▓▓│  │▓▓▓│  │▓▓▓│  │░░░│  │░░░│         │
│  │▓▓▓│  │▓▓▓│  │▓▓▓│  │▓▓▓│  │▓▓▓│  │░░░│  │░░░│         │
│  │▒▒▒│  │▒▒▒│  │▒▒▒│  │▒▒▒│  │▒▒▒│  │░░░│  │░░░│         │
│  │▒▒▒│  │▒▒▒│  │▒▒▒│  │▒▒▒│  │▒▒▒│  │░░░│  │░░░│         │
│  │░░░│  │░░░│  │░░░│  │░░░│  │░░░│  │░░░│  │░░░│         │
│  └───┘  └───┘  └───┘  └───┘  └───┘  └───┘  └───┘         │
│                                                              │
│  Each column = one day, stacked by category hours           │
└─────────────────────────────────────────────────────────────┘

Legend:
███ = Sleep (black)
▓▓▓ = Work (brown)
▒▒▒ = Learning (orange)
░░░ = Unassigned (grey) or No log
```

**Features:**
- 7 columns (Mon-Sun)
- Each column is a mini 24-hour stacked grid
- Colors match category colors exactly
- Empty days show as greyed out
- Read-only (no editing)

---

## 2. Insight Cards

**Location:** `/dashboard` (below Weekly Grid)

```
┌─────────────────────────────────────────────────────────────┐
│  Insights                                                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Average Sleep│  │ Most Frequent│  │ Most Balanced│     │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤     │
│  │              │  │              │  │              │     │
│  │   7.5h/day   │  │  💼 Work     │  │  Wed, Jan 8  │     │
│  │              │  │              │  │              │     │
│  │ Over 7 days  │  │   40h/week   │  │ Lowest var.  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Card 1: Average Sleep**
- Shows hours per day
- Only counts logged days
- Format: `X.Xh/day`
- Subtitle: "Over N logged days"

**Card 2: Most Frequent**
- Category with most hours
- Shows icon + name
- Total hours for the week
- Excludes unassigned

**Card 3: Most Balanced Day**
- Day with lowest variance
- Shows date in friendly format
- Subtitle: "Lowest variance in time distribution"

---

## 3. Category Donut Chart

**Location:** `/dashboard` (below Insight Cards)

```
┌─────────────────────────────────────────────────────────────┐
│  Category Distribution                                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│         ╭─────────╮                                         │
│       ╱   Total   ╲         Legend:                         │
│      │             │                                         │
│      │    168h     │        ⚫ 🌙 Sleep: 52h (31%)          │
│      │             │        🟤 💼 Work: 40h (24%)           │
│       ╲           ╱         🟠 📘 Learning: 20h (12%)       │
│         ╰─────────╯         🟡 🧠 Deep Think: 10h (6%)      │
│                             🟢 🏋️ Exercise: 8h (5%)         │
│                             ... (more categories)            │
│                             ⚪ Unassigned: 5h (3%)           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Donut/pie chart showing proportions
- SVG-based rendering
- Center shows total hours
- Legend with icons, names, hours, percentages
- Includes unassigned in grey
- Hover tooltips on segments
- Fully responsive

---

## 4. Category Totals (Sorted)

**Location:** `/dashboard` (below Donut Chart)

```
┌─────────────────────────────────────────────────────────────┐
│  Hours by Category (sorted)                                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  🌙  Sleep                                    52h    31%    │
│  💼  Work                                     40h    24%    │
│  📘  Learning & Building                     20h    12%    │
│  🧠  Deep Thinking / Reflection              10h     6%    │
│  🏋️  Exercise & Health                        8h     5%    │
│  🧑‍🤝‍🧑  Friends & Social                          6h     4%    │
│  🎮  Relaxation & Leisure                     5h     3%    │
│  ⚪  Unassigned                                5h     3%    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Sorted descending by hours
- Icon + name + hours + percentage
- Unassigned shown at bottom (if present)
- Clean, scannable layout

---

## 5. Enhanced Hour Grid (Main Page)

**Location:** `/` (main logging page)

### Before V3 (V2):
```
┌────┬────┬────┬────┬────┬────┬────┬────┐
│00:00│01:00│02:00│03:00│04:00│05:00│06:00│07:00│
│ 🌙 │ 🌙 │ 🌙 │ 🌙 │ 🌙 │ 🌙 │ 🌙 │ 💼 │
│Sleep│Sleep│Sleep│Sleep│Sleep│Sleep│Sleep│Work │
└────┴────┴────┴────┴────┴────┴────┴────┘
```

### After V3 (Icon-Only):
```
┌────┬────┬────┬────┬────┬────┬────┬────┐
│ 🌙 │ 🌙 │ 🌙 │ 🌙 │ 🌙 │ 🌙 │ 🌙 │ 💼 │
│    │    │    │    │    │    │    │    │
│    │    │    │    │    │    │    │    │
│  ₀ │  ₁ │  ₂ │  ₃ │  ₄ │  ₅ │  ₆ │  ₇ │
└────┴────┴────┴────┴────┴────┴────┴────┘
     ↑
  Hover shows: "Sleep"
```

**V3 Enhancements:**
- **Icon-only:** Large icons, no text inside blocks
- **Hover tooltips (desktop):** Category name appears on hover
- **Hour index:** Small number in corner
- **Unassigned blocks:** Show time (e.g., "14:00"), no icon
- **Larger icons:** 3xl on mobile, 2xl on desktop
- **Smooth hover:** Scale effect on hover

---

## 6. Mobile Timeline View

**Location:** `/` (main logging page, mobile only)

### Toggle Buttons (Mobile < 640px):
```
┌─────────────────────────────────────┐
│  [ Grid ]  [ Timeline ]             │
└─────────────────────────────────────┘
```

### Timeline View:
```
┌─────────────────────────────────────┐
│  Timeline for 2026-01-11            │
├─────────────────────────────────────┤
│                                     │
│  00:00  ┌──────────────────────┐   │
│         │ 🌙 Sleep             │   │
│         └──────────────────────┘   │
│                                     │
│  01:00  ┌──────────────────────┐   │
│         │ 🌙 Sleep             │   │
│         └──────────────────────┘   │
│                                     │
│  02:00  ┌──────────────────────┐   │
│         │ 🌙 Sleep             │   │
│         └──────────────────────┘   │
│                                     │
│  ...    (20 more hours)             │
│                                     │
│  23:00  ┌──────────────────────┐   │
│         │ 🎮 Relaxation        │   │
│         └──────────────────────┘   │
│                                     │
│  Switch to Grid view to edit hours  │
└─────────────────────────────────────┘
```

**Features:**
- **Mobile-only:** Only visible on screens < 640px
- **Toggle:** Grid ↔ Timeline
- **Vertical list:** All 24 hours
- **Colored blocks:** Background matches category color
- **Icon + name:** Both displayed
- **Read-only:** Must switch to Grid to edit
- **Default:** Grid view on page load

---

## 7. Week Summary Stats

**Location:** `/dashboard` (below Weekly Grid)

```
┌─────────────────────────────────────────────────────────────┐
│  Week Summary                                                │
│  2026-01-05 → 2026-01-11                                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │Total tracked │  │Average sleep │  │ Logged days  │     │
│  │     168      │  │ 7.5h (7 days)│  │      7       │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Color Reference

### Category Colors (in order 0-11):

| ID | Category               | Color      | Hex       | Icon |
|----|------------------------|------------|-----------|------|
| 0  | Sleep                  | Black      | `#000000` | 🌙   |
| 1  | Work                   | Brown      | `#7b3f00` | 💼   |
| 2  | Learning & Building    | Orange     | `#ff8c00` | 📘   |
| 3  | Deep Thinking          | Amber      | `#ffc107` | 🧠   |
| 4  | Exercise & Health      | Green      | `#2e7d32` | 🏋️   |
| 5  | Friends & Social       | Light Blue | `#81d4fa` | 🧑‍🤝‍🧑   |
| 6  | Relaxation & Leisure   | Dark Blue  | `#1e3a8a` | 🎮   |
| 7  | Dating / Partner       | Purple     | `#c084fc` | ❤️   |
| 8  | Family                 | Deep Purple| `#6a1b9a` | 👪   |
| 9  | Life Admin / Chores    | Dark Green | `#1b5e20` | 🧾   |
| 10 | Travel / Commute       | Brown      | `#6d4c41` | ✈️   |
| 11 | Getting Ready / Misc   | Tan        | `#d2b48c` | 🚿   |
| -1 | Unassigned             | Grey       | `#3f3f46` | ⚪   |

---

## 📱 Responsive Breakpoints

### Mobile (< 640px)
- Hour grid: 3 columns
- Timeline toggle visible
- Donut chart stacks vertically
- Cards stack vertically

### Tablet (640px - 768px)
- Hour grid: 6 columns
- Side-by-side layouts
- Timeline toggle hidden

### Desktop (> 768px)
- Hour grid: 8 columns
- Hover tooltips active
- Optimal spacing
- Timeline toggle hidden

---

## 🖱️ Interactions

### Desktop
- **Hover** over hour blocks → Category name tooltip appears
- **Hover** over donut segments → Details tooltip
- **Click** hour block → Cycle to next category
- **Click** Save → Persist changes

### Mobile
- **Tap** hour block → Cycle to next category
- **Long-press** hour block → Native tooltip (via title attribute)
- **Tap** Grid/Timeline toggle → Switch views
- **Tap** Save → Persist changes

---

## 🎯 User Flow

### Logging a Day
1. Visit `/` (main page)
2. Select date
3. Click hour blocks to assign categories
4. Click Save

### Viewing Dashboard
1. Visit `/dashboard`
2. See weekly overview grid (7 days)
3. Review insight cards
4. Explore donut chart
5. Check category totals

### Mobile Timeline
1. Visit `/` on mobile
2. Click "Timeline" toggle
3. Scroll through 24 hours
4. Switch back to "Grid" to edit

---

## 🔍 What to Look For

### Quality Indicators
- ✅ Smooth animations
- ✅ Consistent colors
- ✅ Clear typography
- ✅ Intuitive navigation
- ✅ Fast loading
- ✅ No layout shifts

### Design Philosophy
- ✅ Calm, not urgent
- ✅ Honest, not judgmental
- ✅ Reflective, not prescriptive
- ✅ Simple, not complex
- ✅ Beautiful, not flashy

---

## 📸 Screenshot Checklist

If documenting for portfolio:

1. **Dashboard - Full View**
   - Weekly grid + insights + donut + totals

2. **Dashboard - Weekly Grid Close-Up**
   - Show 7-day stacked grids clearly

3. **Dashboard - Insight Cards**
   - All 3 cards visible

4. **Dashboard - Donut Chart**
   - Chart + legend

5. **Main Page - Hour Grid (Desktop)**
   - Show hover tooltip

6. **Main Page - Hour Grid (Mobile)**
   - 3-column layout

7. **Mobile Timeline View**
   - Toggle buttons + timeline

8. **Empty State**
   - Dashboard with no data

---

## 🎨 Design Tokens

```css
/* Surface Colors */
--background: #0f0f0f
--surface: #1a1a1a
--surface-hover: #252525
--border: #2a2a2a

/* Text Colors */
--foreground: #e8e8e8
--text-secondary: #a1a1a1
--text-tertiary: #6b6b6b

/* Accent */
--accent: #3b82f6
--accent-hover: #2563eb

/* Category Colors */
(see table above)
```

---

## 🌟 Visual Highlights

### What Makes V3 Special

1. **Weekly Grid:** Instant visual overview of the week
2. **Insights:** Data-driven without being judgmental
3. **Donut Chart:** Beautiful proportional visualization
4. **Icon-Only Blocks:** Cleaner, more visual
5. **Mobile Timeline:** Alternative view for small screens
6. **Hover Tooltips:** Progressive disclosure
7. **Responsive:** Works perfectly on all devices

---

## 📐 Layout Hierarchy

```
Dashboard Page
│
├─ Header (fixed)
├─ Back Link
├─ Weekly Grid (prominent)
├─ Insights (3 cards, equal width)
├─ Donut Chart (with legend)
├─ Week Summary (3 stats)
└─ Category Totals (sorted list)

Main Logging Page
│
├─ Header (fixed)
├─ Date Selector + Save Button
├─ [Mobile] View Toggle
├─ Hour Grid OR Timeline
├─ Daily Summary (highlight + reflection)
└─ Category Legend
```

---

**Visual Guide Version:** V3  
**Last Updated:** January 11, 2026

For technical details, see `V3_ARCHITECTURE.md`  
For testing guide, see `QUICKSTART_V3.md`

