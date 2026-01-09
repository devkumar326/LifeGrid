import { useMemo } from "react";

import { CATEGORIES, CATEGORY_COUNT, UNASSIGNED } from "../lib/categories";

type DailySummaryProps = {
  hours: number[];
  highlight: string;
  reflection: string;
  onHighlightChange: (value: string) => void;
  onReflectionChange: (value: string) => void;
  disabled: boolean;
};

export default function DailySummary({
  hours,
  highlight,
  reflection,
  onHighlightChange,
  onReflectionChange,
  disabled,
}: DailySummaryProps) {
  const { trackedHours, unassignedHours, top3 } = useMemo(() => {
    const counts = Array(CATEGORY_COUNT).fill(0) as number[];
    let unassigned = 0;

    for (const v of hours) {
      if (v === UNASSIGNED || v === null || typeof v !== "number") {
        unassigned += 1;
        continue;
      }
      if (v >= 0 && v < CATEGORY_COUNT) counts[v] += 1;
    }

    const tracked = counts.reduce((a, b) => a + b, 0);

    const top = counts
      .map((count, idx) => ({ idx, count }))
      .filter((x) => x.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map((x) => ({
        name: CATEGORIES[x.idx]?.name ?? `Category ${x.idx}`,
        hours: x.count,
      }));

    return { trackedHours: tracked, unassignedHours: unassigned, top3: top };
  }, [hours]);

  return (
    <div className="mt-8 border-t border-[var(--border)] pt-6">
      <h2 className="text-sm font-medium text-zinc-300 mb-3">Daily Summary</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3">
          <div className="text-xs text-zinc-400">Tracked hours</div>
          <div className="text-lg font-semibold">{trackedHours}</div>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3">
          <div className="text-xs text-zinc-400">Unassigned hours</div>
          <div className="text-lg font-semibold">{unassignedHours}</div>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3">
          <div className="text-xs text-zinc-400">Top categories</div>
          <div className="text-sm text-zinc-200 mt-1">
            {top3.length === 0 ? (
              <span className="text-zinc-500">No tracked hours yet</span>
            ) : (
              <ul className="space-y-1">
                {top3.map((x) => (
                  <li key={x.name} className="flex items-center justify-between gap-3">
                    <span className="truncate">{x.name}</span>
                    <span className="text-zinc-400 tabular-nums">{x.hours}h</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-xs text-zinc-400 mb-2">Highlight</label>
          <textarea
            value={highlight}
            onChange={(e) => onHighlightChange(e.target.value)}
            disabled={disabled}
            maxLength={180}
            rows={2}
            placeholder="A small win, moment, or focus for the day…"
            className="w-full min-h-20 bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-60 resize-y"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-2">Reflection</label>
          <textarea
            value={reflection}
            onChange={(e) => onReflectionChange(e.target.value)}
            disabled={disabled}
            maxLength={4000}
            rows={6}
            placeholder="Anything you want to remember from today…"
            className="w-full min-h-36 bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-60 resize-y"
          />
        </div>
      </div>
    </div>
  );
}


