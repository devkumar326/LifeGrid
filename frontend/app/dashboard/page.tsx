"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import Header from "../../components/Header";
import { fetchWeeklyDashboard } from "../../lib/api";
import { CATEGORIES } from "../../lib/categories";
import type { WeeklyDashboardResponse } from "../../types/dashboard";

export default function DashboardPage() {
  const [data, setData] = useState<WeeklyDashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchWeeklyDashboard();
        setData(res);
      } catch (e) {
        console.error(e);
        setError("Could not load dashboard. Backend may be offline.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const avgSleepLabel = useMemo(() => {
    if (!data) return "";
    const n = data.logged_days;
    if (n === 0) return "0.0h (no logged days)";
    return `${data.average_sleep_hours.toFixed(1)}h (avg over ${n} logged day${n === 1 ? "" : "s"})`;
  }, [data]);

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <Header />

        <div className="mb-6 flex items-center gap-3 text-sm text-zinc-400">
          <Link className="hover:text-zinc-200 transition-colors" href="/">
            ← Back to Log
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 mb-8">
          <h2 className="text-sm font-medium text-zinc-300 mb-1">Weekly Dashboard</h2>
          <p className="text-xs text-zinc-500">
            Last 7 days ({data?.start_date ?? "…"} → {data?.end_date ?? "…"})
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <div className="bg-black/20 border border-white/5 rounded-lg p-3">
              <div className="text-xs text-zinc-400">Total tracked hours</div>
              <div className="text-lg font-semibold">{data?.total_tracked_hours ?? "—"}</div>
            </div>
            <div className="bg-black/20 border border-white/5 rounded-lg p-3">
              <div className="text-xs text-zinc-400">Average sleep</div>
              <div className="text-sm text-zinc-200 mt-1">{data ? avgSleepLabel : "—"}</div>
            </div>
            <div className="bg-black/20 border border-white/5 rounded-lg p-3">
              <div className="text-xs text-zinc-400">Logged days</div>
              <div className="text-lg font-semibold">{data?.logged_days ?? "—"}</div>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-zinc-300">Hours by Category (7 days)</h2>
            {loading && <span className="text-xs text-zinc-500">Loading…</span>}
          </div>

          {!data ? (
            <div className="text-sm text-zinc-500">No data yet.</div>
          ) : (
            <div className="space-y-3">
              {data.days.map((day) => {
                const segments: { key: string; className: string; hours: number; label: string }[] =
                  [];

                // Unassigned first (honesty)
                if (day.unassigned_hours > 0) {
                  segments.push({
                    key: "unassigned",
                    className: "cat-unassigned",
                    hours: day.unassigned_hours,
                    label: `Unassigned: ${day.unassigned_hours}h`,
                  });
                }

                day.counts.forEach((h, idx) => {
                  if (!h) return;
                  const cat = CATEGORIES[idx];
                  segments.push({
                    key: String(idx),
                    className: cat?.colorClass ?? "cat-unassigned",
                    hours: h,
                    label: `${cat?.name ?? `Category ${idx}`}: ${h}h`,
                  });
                });

                return (
                  <div key={day.date} className="flex items-center gap-3">
                    <div className="w-24 text-xs text-zinc-500 font-mono">{day.date}</div>
                    <div className="flex-1">
                      <div className="h-6 w-full bg-black/20 border border-white/5 rounded overflow-hidden flex">
                        {segments.length === 0 ? (
                          <div
                            className="h-full w-full cat-unassigned opacity-40"
                            title="No log"
                          />
                        ) : (
                          segments.map((s) => (
                            <div
                              key={s.key}
                              className={`${s.className} h-full`}
                              style={{ width: `${(s.hours / 24) * 100}%` }}
                              title={s.label}
                            />
                          ))
                        )}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">
                        {day.has_log ? (
                          <>
                            Tracked {day.tracked_hours}h • Unassigned {day.unassigned_hours}h
                          </>
                        ) : (
                          "No log"
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


