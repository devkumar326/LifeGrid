import { DateStatus } from "../types/dayLog";

type DateSelectorProps = {
  dateString: string;
  onDateChange: (value: string) => void;
  dateStatus: DateStatus;
  loading: boolean;
};

export default function DateSelector({
  dateString,
  onDateChange,
  dateStatus,
  loading,
}: DateSelectorProps) {
  const isFuture = dateStatus === "future";
  const isReconstructedView = dateStatus === "reconstructed";

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <label htmlFor="date-picker" className="text-sm text-zinc-400">
          Date:
        </label>
        <input
          id="date-picker"
          type="date"
          value={dateString}
          onChange={(e) => onDateChange(e.target.value)}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>

      <span
        className={`px-3 py-1 text-xs rounded-full border ${
          isFuture
            ? "border-yellow-500/40 text-yellow-300 bg-yellow-500/10"
            : isReconstructedView
            ? "border-blue-400/40 text-blue-200 bg-blue-500/10"
            : "border-green-400/40 text-green-200 bg-green-500/10"
        }`}
      >
        {isFuture ? "Future (locked)" : isReconstructedView ? "Reconstructed" : "Live"}
      </span>

      {loading && <span className="text-sm text-zinc-500">Loading...</span>}
    </div>
  );
}

