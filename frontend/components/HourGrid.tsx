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

export default function HourGrid({
  hours,
  onHourClick,
  disabled,
  isReconstructedView,
}: HourGridProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-3 sm:gap-2 mb-8">
      {hours.map((categoryIndex, hourIndex) => (
        (() => {
          const isUnassigned = categoryIndex === UNASSIGNED || Number.isNaN(categoryIndex);
          const category = isUnassigned ? null : CATEGORIES[categoryIndex];
          const colorClass = isUnassigned ? "cat-unassigned" : category?.colorClass ?? "cat-unassigned";
          const title = isUnassigned
            ? `${formatHour(hourIndex)} — Unassigned`
            : `${formatHour(hourIndex)} — ${category?.name ?? "Unknown"}`;

          return (
        <button
          key={hourIndex}
          onClick={disabled ? undefined : () => onHourClick(hourIndex)}
          disabled={disabled}
          className={`
            ${colorClass}
            aspect-square min-h-11 min-w-11 rounded-lg flex flex-col items-center justify-center
            touch-manipulation active:scale-[0.98] transition-transform
            sm:hover:opacity-80
            border border-white/10
            ${isReconstructedView ? "opacity-70" : ""}
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]
          `}
          title={title}
          aria-label={title}
        >
          <span className="text-xs sm:text-[11px] font-mono opacity-70">{formatHour(hourIndex)}</span>
          {!isUnassigned && category?.icon ? (
            <span className="text-lg sm:text-base mt-1 opacity-80 leading-none">{category.icon}</span>
          ) : (
            <span className="text-lg sm:text-base mt-1 opacity-0 leading-none">•</span>
          )}
        </button>
          );
        })()
      ))}
    </div>
  );
}

