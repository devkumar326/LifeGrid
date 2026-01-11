"use client";

import { useState } from "react";
import { CATEGORIES, UNASSIGNED } from "../lib/categories";

type HourGridProps = {
  hours: number[];
  onHourClick: (hourIndex: number) => void;
  disabled: boolean;
  isReconstructedView: boolean;
};

function formatHour(hour: number): string {
  return `${hour.toString().padStart(2, "0")}:00`;
}

/**
 * Hour Grid - V3 Enhanced
 * 
 * - Icon-only mode: Shows category icon without text inside blocks
 * - Hover tooltips: Category name appears on hover (desktop)
 * - Long-press support: Category name on long-press (mobile) - handled via title attribute
 * - Unassigned hours: Grey background, no icon, tooltip shows "HH:00 — Unassigned"
 */
export default function HourGrid({
  hours,
  onHourClick,
  disabled,
  isReconstructedView,
}: HourGridProps) {
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);

  return (
    <div className="mb-8">
      <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-3 sm:gap-2">
        {hours.map((categoryIndex, hourIndex) => {
          const isUnassigned = categoryIndex === UNASSIGNED || Number.isNaN(categoryIndex);
          const category = isUnassigned ? null : CATEGORIES[categoryIndex];
          const colorClass = isUnassigned ? "cat-unassigned" : category?.colorClass ?? "cat-unassigned";
          const title = isUnassigned
            ? `${formatHour(hourIndex)} — Unassigned`
            : `${formatHour(hourIndex)} — ${category?.name ?? "Unknown"}`;

          return (
            <div key={hourIndex} className="relative">
              <button
                onClick={disabled ? undefined : () => onHourClick(hourIndex)}
                onMouseEnter={() => setHoveredHour(hourIndex)}
                onMouseLeave={() => setHoveredHour(null)}
                disabled={disabled}
                className={`
                  ${colorClass}
                  w-full aspect-square min-h-11 min-w-11 rounded-lg flex flex-col items-center justify-center
                  touch-manipulation active:scale-[0.98] transition-all duration-200
                  sm:hover:opacity-90 sm:hover:scale-105
                  border border-white/10
                  ${isReconstructedView ? "opacity-70" : ""}
                  ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]
                  relative group
                `}
                title={title}
                aria-label={title}
              >
                {/* Icon only - V3 */}
                {!isUnassigned && category?.icon ? (
                  <span className="text-3xl sm:text-2xl leading-none">{category.icon}</span>
                ) : (
                  <span className="text-xs text-zinc-600 font-mono">{formatHour(hourIndex)}</span>
                )}

                {/* Hour label overlay - subtle */}
                <span className="absolute bottom-1 right-1 text-[9px] font-mono opacity-40 pointer-events-none">
                  {hourIndex}
                </span>
              </button>

              {/* Desktop hover tooltip - V3 */}
              {hoveredHour === hourIndex && !isUnassigned && category && (
                <div className="hidden sm:block absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-200 whitespace-nowrap pointer-events-none shadow-lg">
                  {category.name}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px border-4 border-transparent border-t-zinc-700" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend hint */}
      <div className="mt-3 text-xs text-zinc-600 text-center">
        Click to cycle categories • Hover to see names
      </div>
    </div>
  );
}

