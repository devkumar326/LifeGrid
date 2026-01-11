import { CATEGORIES } from "../lib/categories";
import type { CategoryTotal, WeeklyInsights } from "../types/dashboard";

type InsightCardsProps = {
  insights: WeeklyInsights;
  categoryTotals: CategoryTotal[];
  loggedDays: number;
};

/**
 * Insight Cards - V3
 * 
 * Displays three computed insights:
 * 1. Average Sleep (hours/day) - calculated only from logged days
 * 2. Most Frequent Category - excluding unassigned
 * 3. Most Balanced Day - day with lowest variance in category distribution
 * 
 * Card-based layout with short labels only. No recommendations or coaching.
 */
export default function InsightCards({ 
  insights, 
  categoryTotals,
  loggedDays 
}: InsightCardsProps) {
  // Format average sleep
  const avgSleepLabel = loggedDays > 0 
    ? `${insights.average_sleep_hours.toFixed(1)}h/day`
    : "No data";

  // Get most frequent category name
  const mostFrequentCat = insights.most_frequent_category !== null
    ? CATEGORIES[insights.most_frequent_category]
    : null;

  // Format most balanced day
  const balancedDayLabel = insights.most_balanced_day
    ? new Date(insights.most_balanced_day + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "No data";

  return (
    <div className="mb-6">
      <h2 className="text-sm font-medium text-zinc-300 mb-3">Insights</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Average Sleep */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
          <div className="text-xs text-zinc-500 mb-1">Average Sleep</div>
          <div className="text-2xl font-semibold text-zinc-200">{avgSleepLabel}</div>
          {loggedDays > 0 && (
            <div className="text-xs text-zinc-600 mt-1">
              Over {loggedDays} logged day{loggedDays === 1 ? "" : "s"}
            </div>
          )}
        </div>

        {/* Most Frequent Category */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
          <div className="text-xs text-zinc-500 mb-1">Most Frequent</div>
          {mostFrequentCat ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{mostFrequentCat.icon}</span>
                <span className="text-lg font-medium text-zinc-200">
                  {mostFrequentCat.name}
                </span>
              </div>
              <div className="text-xs text-zinc-600">
                {categoryTotals[0]?.hours ?? 0}h this week
              </div>
            </>
          ) : (
            <div className="text-lg text-zinc-500">No data</div>
          )}
        </div>

        {/* Most Balanced Day */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
          <div className="text-xs text-zinc-500 mb-1">Most Balanced Day</div>
          <div className="text-lg font-medium text-zinc-200">{balancedDayLabel}</div>
          <div className="text-xs text-zinc-600 mt-1">
            Lowest variance in time distribution
          </div>
        </div>
      </div>
    </div>
  );
}

