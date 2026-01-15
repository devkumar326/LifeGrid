"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import CategoryLegend from "../components/CategoryLegend";
import DateSelector from "../components/DateSelector";
import Header from "../components/Header";
import HourGrid from "../components/HourGrid";
import MobileTimeline from "../components/MobileTimeline";
import DailySummary from "../components/DailySummary";
import {
  fetchDayLog,
  fetchDailySummary,
  fetchDream,
  saveDayLog,
  saveDailySummary,
  saveDream,
} from "../lib/api";
import { CATEGORY_COUNT, UNASSIGNED } from "../lib/categories";
import {
  getDateStatusFromString,
  isValidDateString,
  todayString,
} from "../lib/date";
import type { DateStatus } from "../types/dayLog";
import { DreamState } from "../types/dream";

// Default hours: all set to Unassigned (-1)
const DEFAULT_HOURS = (): number[] => Array(24).fill(UNASSIGNED);

export default function Home() {
  const [selectedDateString, setSelectedDateString] = useState<string>(todayString());
  const [hours, setHours] = useState<number[]>(DEFAULT_HOURS());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isReconstructedFlag, setIsReconstructedFlag] = useState(false);
  const [highlight, setHighlight] = useState<string>("");
  const [reflection, setReflection] = useState<string>("");
  const [hasUnsavedSummaryChanges, setHasUnsavedSummaryChanges] = useState(false);
  const [dreamState, setDreamState] = useState<DreamState>(DreamState.None);
  const [dreamDescription, setDreamDescription] = useState("");
  const [hasUnsavedDreamChanges, setHasUnsavedDreamChanges] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("grid");
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const dateStatus: DateStatus = useMemo(
    () => getDateStatusFromString(selectedDateString),
    [selectedDateString]
  );
  const isFuture = dateStatus === "future";
  const isReconstructedView = dateStatus === "reconstructed" || isReconstructedFlag;

  /**
   * Fetch day log from backend for the selected date string.
   * Keeps the date string as the source of truth to avoid invalid Date objects.
   */
  const loadDayLog = useCallback(async (dateString: string) => {
    if (!isValidDateString(dateString)) {
      setError("Please pick a valid date.");
      setHours(DEFAULT_HOURS());
      setIsReconstructedFlag(false);
      setHasUnsavedChanges(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [data, summary, dream] = await Promise.all([
        fetchDayLog(dateString),
        fetchDailySummary(dateString),
        fetchDream(dateString),
      ]);

      if (data === null) {
        // No log exists for this date - use defaults
        setHours(DEFAULT_HOURS());
        setIsReconstructedFlag(false);
      } else {
        setHours(data.hours);
        // Surface reconstructed flag from backend (mirrors date status)
        setIsReconstructedFlag(Boolean(data.is_reconstructed));
      }

      if (summary === null) {
        setHighlight("");
        setReflection("");
      } else {
        setHighlight(summary.highlight ?? "");
        setReflection(summary.reflection ?? "");
      }

      if (dream === null) {
        setDreamState(DreamState.None);
        setDreamDescription("");
      } else {
        setDreamState(dream.dream_state ?? DreamState.None);
        setDreamDescription(dream.description ?? "");
      }

      setHasUnsavedChanges(false);
      setHasUnsavedSummaryChanges(false);
      setHasUnsavedDreamChanges(false);
    } catch (err) {
      // If backend is down, still allow local editing
      console.error("Failed to fetch day log:", err);
      setError("Could not load data. Backend may be offline.");
      setHours(DEFAULT_HOURS());
      setIsReconstructedFlag(false);
      setHighlight("");
      setReflection("");
      setDreamState(DreamState.None);
      setDreamDescription("");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Save current hours to backend.
   */
  const handleSave = async () => {
    if (!isValidDateString(selectedDateString)) {
      setError("Please pick a valid date.");
      return;
    }

    if (isFuture) {
      // Guard against accidental saves when UI is disabled
      setError("You can’t log future days");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const ops: Promise<void>[] = [];
      if (hasUnsavedChanges) ops.push(saveDayLog(selectedDateString, hours));
      if (hasUnsavedSummaryChanges) {
        ops.push(saveDailySummary(selectedDateString, { highlight, reflection }));
      }
      if (hasUnsavedDreamChanges) {
        ops.push(
          saveDream({
            date: selectedDateString,
            dream_state: dreamState,
            description: dreamDescription || null,
          })
        );
      }
      await Promise.all(ops);

      setHasUnsavedChanges(false);
      setHasUnsavedSummaryChanges(false);
      setHasUnsavedDreamChanges(false);
    } catch (err) {
      console.error("Failed to save day log:", err);
      setError("Could not save. Backend may be offline.");
    } finally {
      setSaving(false);
    }
  };

  /**
   * Cycle through categories when clicking an hour block.
   */
  const handleHourClick = (hourIndex: number) => {
    if (isFuture) {
      setError("You can’t log future days");
      return;
    }

    setHours((prev) => {
      const newHours = [...prev];
      const current = newHours[hourIndex];
      // First click on Unassigned assigns the first real category (0 = Sleep)
      newHours[hourIndex] = current === UNASSIGNED ? 0 : (current + 1) % CATEGORY_COUNT;
      return newHours;
    });
    setHasUnsavedChanges(true);
  };

  // Fetch data when date changes
  useEffect(() => {
    loadDayLog(selectedDateString);
  }, [selectedDateString, loadDayLog]);

  const handleDateChange = (value: string) => {
    // The raw string is the source of truth; invalid/empty strings are handled upstream.
    setSelectedDateString(value);
  };

  const hasUnsavedAnyChanges =
    hasUnsavedChanges || hasUnsavedSummaryChanges || hasUnsavedDreamChanges;

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-10 pt-[calc(1rem+env(safe-area-inset-top))] pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <div className="max-w-4xl mx-auto">
        <Header />

        {/* Date Selector & Save Button */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4 mb-8">
          <div className="w-full sm:w-auto">
            <DateSelector
              dateString={selectedDateString}
              onDateChange={handleDateChange}
              dateStatus={dateStatus}
              loading={loading}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !hasUnsavedAnyChanges || isFuture}
            className="w-full sm:w-auto min-h-11 px-4 py-3 sm:py-2 bg-[var(--accent)] sm:hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
          >
            {saving ? "Saving..." : hasUnsavedAnyChanges ? "Save" : "Saved"}
          </button>
        </div>

        {isFuture && (
          <div className="mb-4 text-sm text-yellow-300">
            You can&apos;t log future days.
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Mobile View Toggle - V3 */}
        {isMobile && (
          <div className="mb-4 flex items-center gap-2 justify-center">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--surface)] text-zinc-400 border border-[var(--border)]"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "timeline"
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--surface)] text-zinc-400 border border-[var(--border)]"
              }`}
            >
              Timeline
            </button>
          </div>
        )}

        {/* Hour Grid or Timeline - V3 */}
        {viewMode === "grid" || !isMobile ? (
          <HourGrid
            hours={hours}
            onHourClick={handleHourClick}
            disabled={isFuture}
            isReconstructedView={isReconstructedView}
          />
        ) : (
          <div className="mb-8">
            <MobileTimeline hours={hours} date={selectedDateString} />
            <div className="mt-4 text-xs text-zinc-500 text-center">
              Switch to Grid view to edit hours
            </div>
          </div>
        )}

        <DailySummary
          hours={hours}
          highlight={highlight}
          reflection={reflection}
          dreamState={dreamState}
          dreamDescription={dreamDescription}
          onHighlightChange={(v) => {
            setHighlight(v);
            setHasUnsavedSummaryChanges(true);
          }}
          onReflectionChange={(v) => {
            setReflection(v);
            setHasUnsavedSummaryChanges(true);
          }}
          onDreamStateChange={(state) => {
            if (state === DreamState.None) {
              setDreamDescription("");
            }
            setDreamState(state);
            setHasUnsavedDreamChanges(true);
          }}
          onDreamDescriptionChange={(value) => {
            setDreamDescription(value);
            setHasUnsavedDreamChanges(true);
          }}
          disabled={isFuture}
        />

        {/* Legend */}
        <CategoryLegend />

        {/* Instructions */}
        <div className="mt-8 text-xs text-zinc-500">
          <p>Click any hour block to cycle through categories. Don&apos;t forget to save!</p>
        </div>
      </div>
    </div>
  );
}
