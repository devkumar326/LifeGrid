import { CATEGORIES } from "../lib/categories";

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
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mb-8">
      {hours.map((categoryIndex, hourIndex) => (
        <button
          key={hourIndex}
          onClick={disabled ? undefined : () => onHourClick(hourIndex)}
          disabled={disabled}
          className={`
            ${CATEGORIES[categoryIndex].colorClass}
            aspect-square rounded-lg flex flex-col items-center justify-center
            hover:opacity-80 active:scale-95 transition-all
            border border-white/10
            ${isReconstructedView ? "opacity-70" : ""}
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
          title={`${formatHour(hourIndex)} — ${CATEGORIES[categoryIndex].name}`}
        >
          <span className="text-xs font-mono opacity-70">{formatHour(hourIndex)}</span>
          <span className="text-base mt-1 opacity-80">{CATEGORIES[categoryIndex].icon}</span>
        </button>
      ))}
    </div>
  );
}

