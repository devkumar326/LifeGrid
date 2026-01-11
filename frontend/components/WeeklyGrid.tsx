import { CATEGORIES, UNASSIGNED } from "../lib/categories";
import type { WeeklyDashboardDay } from "../types/dashboard";

type WeeklyGridProps = {
  days: WeeklyDashboardDay[];
};

/**
 * Weekly Overview Grid - V3
 * 
 * Displays a 7-column grid (Mon-Sun) with mini 24-hour stacked grids per day.
 * Read-only visualization of the week's time distribution.
 * Colors map exactly to existing category colors, including unassigned (grey).
 */
export default function WeeklyGrid({ days }: WeeklyGridProps) {
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 mb-6">
      <h2 className="text-sm font-medium text-zinc-300 mb-4">Weekly Overview</h2>
      
      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {days.map((day, idx) => {
          // Build 24-hour array for this day
          const hourBlocks: { categoryId: number; colorClass: string }[] = [];
          
          if (day.has_log) {
            // Reconstruct 24 hours from counts
            // We need to distribute the counts back into 24 hours
            // Since we only have aggregated counts, we'll create a stacked representation
            for (let cat = 0; cat < 12; cat++) {
              const count = day.counts[cat];
              for (let i = 0; i < count; i++) {
                hourBlocks.push({
                  categoryId: cat,
                  colorClass: CATEGORIES[cat]?.colorClass ?? "cat-unassigned",
                });
              }
            }
            // Add unassigned hours
            for (let i = 0; i < day.unassigned_hours; i++) {
              hourBlocks.push({
                categoryId: UNASSIGNED,
                colorClass: "cat-unassigned",
              });
            }
          }

          const isEmpty = !day.has_log || hourBlocks.length === 0;
          const dateObj = new Date(day.date + "T00:00:00");
          const dayName = dayNames[idx % 7];
          const dateNum = dateObj.getDate();

          return (
            <div key={day.date} className="flex flex-col">
              {/* Day label */}
              <div className="text-center mb-2">
                <div className="text-xs font-medium text-zinc-400">{dayName}</div>
                <div className="text-[10px] text-zinc-600">{dateNum}</div>
              </div>

              {/* Mini 24-hour stacked grid */}
              <div className="flex-1 min-h-[200px] bg-black/20 border border-white/5 rounded overflow-hidden flex flex-col">
                {isEmpty ? (
                  <div className="flex-1 cat-unassigned opacity-30" title="No log" />
                ) : (
                  hourBlocks.map((block, blockIdx) => {
                    const category = block.categoryId === UNASSIGNED 
                      ? null 
                      : CATEGORIES[block.categoryId];
                    const label = category?.name ?? "Unassigned";
                    
                    return (
                      <div
                        key={blockIdx}
                        className={`${block.colorClass} flex-1 min-h-[8px] border-b border-black/10 last:border-b-0`}
                        title={label}
                      />
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile-friendly note */}
      <div className="text-xs text-zinc-600 mt-3 text-center sm:text-left">
        Each column represents one day, stacked by category hours
      </div>
    </div>
  );
}

