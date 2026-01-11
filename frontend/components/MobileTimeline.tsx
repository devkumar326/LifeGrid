"use client";

import { CATEGORIES, UNASSIGNED } from "../lib/categories";

type MobileTimelineProps = {
  hours: number[]; // 24-hour array
  date: string;
};

/**
 * Mobile Timeline View - V3
 * 
 * Optional toggle view for mobile devices showing a vertical timeline of 24 hours.
 * Each hour displays as a colored block with category icon and name.
 * Read-only visualization. Unassigned hours shown in grey with no icon.
 */
export default function MobileTimeline({ hours, date }: MobileTimelineProps) {
  return (
    <div className="space-y-2">
      <div className="text-xs text-zinc-500 mb-3 font-mono">
        Timeline for {date}
      </div>
      
      {hours.map((categoryId, hourIndex) => {
        const isUnassigned = categoryId === UNASSIGNED || Number.isNaN(categoryId);
        const category = isUnassigned ? null : CATEGORIES[categoryId];
        const colorClass = isUnassigned ? "cat-unassigned" : category?.colorClass ?? "cat-unassigned";
        
        const hourLabel = `${hourIndex.toString().padStart(2, "0")}:00`;
        const categoryLabel = isUnassigned ? "Unassigned" : category?.name ?? "Unknown";

        return (
          <div
            key={hourIndex}
            className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-black/20"
          >
            {/* Time label */}
            <div className="text-xs font-mono text-zinc-500 w-12 flex-shrink-0">
              {hourLabel}
            </div>

            {/* Category block */}
            <div
              className={`${colorClass} flex-1 rounded p-3 flex items-center gap-3 min-h-[48px]`}
            >
              {!isUnassigned && category?.icon && (
                <span className="text-2xl flex-shrink-0">{category.icon}</span>
              )}
              <span className="text-sm font-medium text-white">
                {categoryLabel}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

