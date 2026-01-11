# LifeGrid V3 - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+

---

## Backend Setup

```bash
# Navigate to backend
cd backend

# Activate virtual environment
source venv/bin/activate

# Start the server
python -m uvicorn main:app --reload
```

**Server runs at:** http://localhost:8000

**API Docs:** http://localhost:8000/docs

---

## Frontend Setup

```bash
# Navigate to frontend (in a new terminal)
cd frontend

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

**App runs at:** http://localhost:3000

---

## 🧪 Testing V3 Features

### 1. Dashboard - Weekly Overview Grid

**URL:** http://localhost:3000/dashboard

**What to test:**
- [ ] 7-day grid displays (Mon-Sun)
- [ ] Each day shows mini stacked grid
- [ ] Colors match category colors
- [ ] Unassigned hours show in grey
- [ ] Empty days are greyed out
- [ ] Grid is read-only (no editing)

---

### 2. Dashboard - Insight Cards

**URL:** http://localhost:3000/dashboard

**What to test:**
- [ ] **Average Sleep** card shows hours/day
- [ ] Only calculates from logged days
- [ ] **Most Frequent** card shows category icon + name
- [ ] Shows total hours for that category
- [ ] **Most Balanced Day** shows date
- [ ] Displays "lowest variance" explanation

---

### 3. Dashboard - Category Donut Chart

**URL:** http://localhost:3000/dashboard

**What to test:**
- [ ] Donut chart renders correctly
- [ ] All categories with hours are shown
- [ ] Unassigned hours included in grey
- [ ] Legend shows icons, names, hours, percentages
- [ ] Hover over segments shows tooltips
- [ ] Center shows total hours
- [ ] Responsive on mobile

---

### 4. Dashboard - Category Totals

**URL:** http://localhost:3000/dashboard

**What to test:**
- [ ] Categories sorted by hours (descending)
- [ ] Each row shows icon, name, hours, percentage
- [ ] Unassigned shown at bottom (if present)
- [ ] Percentages add up to 100%

---

### 5. Main Page - Enhanced Hour Grid

**URL:** http://localhost:3000/

**What to test:**
- [ ] Hour blocks show **icons only** (no text inside)
- [ ] **Hover** over blocks shows category name tooltip (desktop)
- [ ] Unassigned hours show time (e.g., "14:00")
- [ ] Unassigned hours have grey background, no icon
- [ ] Icons are large and clear
- [ ] Hour index shown in corner (subtle)
- [ ] Click to cycle categories still works

---

### 6. Main Page - Mobile Timeline Toggle

**URL:** http://localhost:3000/

**What to test:**
- [ ] Resize browser to < 640px width (or use mobile device)
- [ ] Toggle buttons appear: **Grid** | **Timeline**
- [ ] Click **Timeline** to switch views
- [ ] Timeline shows 24 hours vertically
- [ ] Each hour shows colored block with icon + name
- [ ] Timeline is read-only
- [ ] Switch back to **Grid** to edit
- [ ] Grid remains default view on page load

---

## 🔍 API Testing

### Test Weekly Dashboard Endpoint

```bash
curl http://localhost:8000/dashboard/weekly | jq
```

**Expected response includes:**
```json
{
  "start_date": "2026-01-05",
  "end_date": "2026-01-11",
  "days": [...],
  "total_tracked_hours": 120,
  "average_sleep_hours": 7.5,
  "logged_days": 7,
  "category_totals": [
    {"category_id": 0, "hours": 52},
    {"category_id": 1, "hours": 40},
    ...
  ],
  "insights": {
    "average_sleep_hours": 7.5,
    "most_frequent_category": 0,
    "most_balanced_day": "2026-01-08"
  }
}
```

---

## 📱 Mobile Testing

### Using Browser DevTools:
1. Open http://localhost:3000
2. Press `F12` to open DevTools
3. Click device toolbar icon (or `Cmd+Shift+M` / `Ctrl+Shift+M`)
4. Select a mobile device (e.g., iPhone 12)
5. Test timeline toggle and responsive layouts

### Using Real Device:
1. Find your computer's local IP: `ifconfig` (Mac/Linux) or `ipconfig` (Windows)
2. On mobile, visit: `http://YOUR_IP:3000`
3. Test touch interactions and timeline view

---

## 🎨 Visual Checklist

### Colors
- [ ] Sleep (0): Black `#000000`
- [ ] Work (1): Brown `#7b3f00`
- [ ] Learning (2): Orange `#ff8c00`
- [ ] Deep Thinking (3): Amber `#ffc107`
- [ ] Exercise (4): Green `#2e7d32`
- [ ] Friends (5): Light Blue `#81d4fa`
- [ ] Relaxation (6): Dark Blue `#1e3a8a`
- [ ] Dating (7): Purple `#c084fc`
- [ ] Family (8): Deep Purple `#6a1b9a`
- [ ] Life Admin (9): Dark Green `#1b5e20`
- [ ] Travel (10): Brown `#6d4c41`
- [ ] Getting Ready (11): Tan `#d2b48c`
- [ ] Unassigned: Grey `#3f3f46`

---

## 🐛 Common Issues

### Backend won't start
```bash
# Make sure PostgreSQL is running
brew services start postgresql  # Mac
sudo service postgresql start   # Linux

# Check database exists
psql -l | grep lifegrid

# Create if missing
createdb lifegrid
```

### Frontend build errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS errors
- Ensure backend is running on port 8000
- Check `CORS_ALLOW_ORIGINS` in backend `.env`
- Default allows all origins (`*`) for development

---

## 📊 Sample Data

To test with sample data, use the main logging page:

1. Go to http://localhost:3000
2. Select a past date
3. Click hour blocks to assign categories
4. Click **Save**
5. Repeat for multiple days
6. Visit http://localhost:3000/dashboard to see insights

---

## ✅ V3 Features Verification

### Backend
- [x] Enhanced `/dashboard/weekly` endpoint
- [x] Category totals computed and sorted
- [x] Insights computed server-side
- [x] Variance calculation for balanced day
- [x] Backward compatible with V2

### Frontend
- [x] WeeklyGrid component (7-day stacked grids)
- [x] InsightCards component (3 insights)
- [x] CategoryDonut component (pie chart)
- [x] MobileTimeline component (mobile toggle)
- [x] Enhanced HourGrid (icon-only + hover tooltips)
- [x] Responsive design (mobile + desktop)

### Non-Goals (Correctly Excluded)
- [x] No streaks
- [x] No goals
- [x] No achievements
- [x] No AI suggestions
- [x] No productivity advice

---

## 📝 Next Steps

After testing:
1. Review code quality and organization
2. Check accessibility (keyboard navigation, ARIA labels)
3. Test on different browsers (Chrome, Firefox, Safari)
4. Verify mobile experience on real devices
5. Consider deployment (Vercel for frontend, Railway/Render for backend)

---

## 🎯 Success Criteria

LifeGrid V3 is ready when:
- ✅ All 7 features implemented
- ✅ No linter errors
- ✅ Responsive on all screen sizes
- ✅ API returns correct data
- ✅ UI matches design philosophy (calm, honest mirror)
- ✅ Code is clean and well-commented
- ✅ Portfolio-ready quality

---

**Happy Testing! 🎉**

For detailed implementation notes, see `V3_IMPLEMENTATION.md`

