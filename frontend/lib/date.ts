import { DateStatus } from "../types/dayLog";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Safely verify that a string looks like YYYY-MM-DD and corresponds to a real Date.
 */
export function isValidDateString(value: string): boolean {
  if (!DATE_REGEX.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00`);
  return !Number.isNaN(parsed.getTime());
}

/**
 * Parse a date string into a Date, or null if invalid.
 * Keeps time at midnight to avoid timezone surprises.
 */
export function parseDateString(value: string): Date | null {
  if (!isValidDateString(value)) return null;
  const parsed = new Date(`${value}T00:00:00`);
  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

/**
 * Return today's date as YYYY-MM-DD (local time).
 */
export function todayString(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = `${today.getMonth() + 1}`.padStart(2, "0");
  const dd = `${today.getDate()}`.padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Compute the date status for hybrid logging using a safe string input.
 * Invalid strings default to "future" to keep the UI read-only until fixed.
 */
export function getDateStatusFromString(dateString: string): DateStatus {
  const parsed = parseDateString(dateString);
  if (!parsed) return "future";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (parsed > today) return "future";
  if (parsed >= yesterday) return "live";
  return "reconstructed";
}

