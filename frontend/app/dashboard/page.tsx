"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import CategoryDonut from "../../components/CategoryDonut";
import Header from "../../components/Header";
import InsightCards from "../../components/InsightCards";
import WeeklyGrid from "../../components/WeeklyGrid";
import { fetchWeeklyDashboard } from "../../lib/api";
import { CATEGORIES } from "../../lib/categories";
import type { WeeklyDashboardResponse } from "../../types/dashboard";

/**
 * Dashboard Page - V3
 * 
 * Features:
 * - Weekly Overview Grid: 7-day mini stacked grids (Mon-Sun)
 * - Insight Cards: Average sleep, most frequent category, most balanced day
 * - Category Distribution: Donut chart with legend
 * - Category Totals: Hours per category sorted descending
 * 
 * All views are read-only. This is a calm reflection tool, not a productivity optimizer.
 */
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

  // Calculate total unassigned hours for the donut chart
  const totalUnassignedHours = useMemo(() => {
    if (!data) return 0;
    return data.days.reduce((sum, day) => sum + day.unassigned_hours, 0);
  }, [data]);

  return (
    <div className="min-h-screen p-6 md:p-10 pt-[calc(1rem+env(safe-area-inset-top))] pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <div className="max-w-6xl mx-auto">
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

        {loading && (
          <div className="text-center py-8 text-zinc-500">Loading dashboard...</div>
        )}

        {!loading && data && (
          <>
            {/* Weekly Overview Grid - V3 */}
            <WeeklyGrid days={data.days} />

            {/* Insights Section - V3 */}
            <InsightCards
              insights={data.insights}
              categoryTotals={data.category_totals}
              loggedDays={data.logged_days}
            />

            {/* Category Distribution Donut - V3 */}
            <CategoryDonut
              categoryTotals={data.category_totals}
              unassignedHours={totalUnassignedHours}
            />

            {/* Summary Stats */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 mb-6">
              <h2 className="text-sm font-medium text-zinc-300 mb-1">Week Summary</h2>
              <p className="text-xs text-zinc-500 mb-4">
                {data.start_date} → {data.end_date}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-black/20 border border-white/5 rounded-lg p-3">
                  <div className="text-xs text-zinc-400">Total tracked hours</div>
                  <div className="text-lg font-semibold">{data.total_tracked_hours}</div>
                </div>
                <div className="bg-black/20 border border-white/5 rounded-lg p-3">
                  <div className="text-xs text-zinc-400">Unassigned hours</div>
                  <div className="text-lg font-semibold">{totalUnassignedHours}</div>
                </div>
                <div className="bg-black/20 border border-white/5 rounded-lg p-3">
                  <div className="text-xs text-zinc-400">Logged days</div>
                  <div className="text-lg font-semibold">{data.logged_days}</div>
                </div>
              </div>

              <div className="mt-4 border-t border-white/5 pt-3">
                <div className="text-xs text-zinc-500 mb-2">Dreams (last 7 days)</div>
                <div className="text-sm text-zinc-300 space-y-1">
                  <div>Dream days: {data.dreams.dream_days}</div>
                  <div>Remembered dreams: {data.dreams.remembered_count}</div>
                  <div>Unremembered dreams: {data.dreams.unremembered_count}</div>
                </div>
              </div>
            </div>

            {/* Category Totals - V3 */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
              <h2 className="text-sm font-medium text-zinc-300 mb-3">
                Hours by Category (sorted)
              </h2>

              <div className="space-y-2">
                {data.category_totals.map((ct) => {
                  const category = CATEGORIES[ct.category_id];
                  const percentage = ((ct.hours / (data.total_tracked_hours + totalUnassignedHours)) * 100).toFixed(0);

                  return (
                    <div
                      key={ct.category_id}
                      className="flex items-center gap-3 p-2 rounded bg-black/20 border border-white/5"
                    >
                      <span className="text-xl flex-shrink-0">{category?.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-zinc-300">{category?.name}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-semibold text-zinc-200">{ct.hours}h</div>
                        <div className="text-xs text-zinc-600">{percentage}%</div>
                      </div>
                    </div>
                  );
                })}

                {totalUnassignedHours > 0 && (
                  <div className="flex items-center gap-3 p-2 rounded bg-black/20 border border-white/5 opacity-60">
                    <span className="text-xl flex-shrink-0">⚪</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-zinc-400">Unassigned</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-semibold text-zinc-400">
                        {totalUnassignedHours}h
                      </div>
                      <div className="text-xs text-zinc-600">
                        {((totalUnassignedHours / (data.total_tracked_hours + totalUnassignedHours)) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {!loading && !data && (
          <div className="text-center py-12 text-zinc-500">
            No dashboard data available yet. Start logging your days!
          </div>
        )}
      </div>
    </div>
  );
}


