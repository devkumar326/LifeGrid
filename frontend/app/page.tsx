"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import CategoryLegend from "../components/CategoryLegend";
import DateSelector from "../components/DateSelector";
import Header from "../components/Header";
import HourGrid from "../components/HourGrid";
import { fetchDayLog, saveDayLog } from "../lib/api";
import { CATEGORY_COUNT } from "../lib/categories";
import {
  getDateStatusFromString,
  isValidDateString,
  todayString,
} from "../lib/date";
import type { DateStatus } from "../types/dayLog";

// Default hours: all set to Sleep (0)
const DEFAULT_HOURS = (): number[] => Array(24).fill(0);

export default function Home() {
  const [selectedDateString, setSelectedDateString] = useState<string>(todayString());
  const [hours, setHours] = useState<number[]>(DEFAULT_HOURS());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isReconstructedFlag, setIsReconstructedFlag] = useState(false);

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
      const data = await fetchDayLog(dateString);

      if (data === null) {
        // No log exists for this date - use defaults
        setHours(DEFAULT_HOURS());
        setIsReconstructedFlag(false);
      } else {
        setHours(data.hours);
        // Surface reconstructed flag from backend (mirrors date status)
        setIsReconstructedFlag(Boolean(data.is_reconstructed));
      }
      setHasUnsavedChanges(false);
    } catch (err) {
      // If backend is down, still allow local editing
      console.error("Failed to fetch day log:", err);
      setError("Could not load data. Backend may be offline.");
      setHours(DEFAULT_HOURS());
      setIsReconstructedFlag(false);
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
      await saveDayLog(selectedDateString, hours);
      setHasUnsavedChanges(false);
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
      newHours[hourIndex] = (newHours[hourIndex] + 1) % CATEGORY_COUNT;
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

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <Header />

        {/* Date Selector & Save Button */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <DateSelector
            dateString={selectedDateString}
            onDateChange={handleDateChange}
            dateStatus={dateStatus}
            loading={loading}
          />

          <button
            onClick={handleSave}
            disabled={saving || !hasUnsavedChanges || isFuture}
            className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
          >
            {saving ? "Saving..." : hasUnsavedChanges ? "Save Day" : "Saved"}
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

        {/* Hour Grid */}
        <HourGrid
          hours={hours}
          onHourClick={handleHourClick}
          disabled={isFuture}
          isReconstructedView={isReconstructedView}
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
