import { DayLogApiResponse } from "../types/dayLog";
import type {
  DailySummaryApiResponse,
  DailySummaryUpsertPayload,
} from "../types/dailySummary";
import type { CreateNotableEventPayload, NotableEvent } from "../types/events";
import type { WeeklyDashboardResponse } from "../types/dashboard";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export async function fetchDayLog(dateString: string): Promise<DayLogApiResponse> {
  const response = await fetch(`${API_BASE}/day-log/${dateString}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }

  return response.json();
}

export async function saveDayLog(dateString: string, hours: number[]): Promise<void> {
  const response = await fetch(`${API_BASE}/day-log/${dateString}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hours }),
  });

  if (!response.ok) {
    throw new Error(`Failed to save: ${response.status}`);
  }
}

export async function fetchDailySummary(
  dateString: string
): Promise<DailySummaryApiResponse> {
  const response = await fetch(`${API_BASE}/daily-summary/${dateString}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch summary: ${response.status}`);
  }

  return response.json();
}

export async function saveDailySummary(
  dateString: string,
  payload: DailySummaryUpsertPayload
): Promise<void> {
  const response = await fetch(`${API_BASE}/daily-summary/${dateString}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to save summary: ${response.status}`);
  }
}

export async function fetchEvents(params?: {
  startDate?: string;
  endDate?: string;
}): Promise<NotableEvent[]> {
  const qs = new URLSearchParams();
  if (params?.startDate) qs.set("start_date", params.startDate);
  if (params?.endDate) qs.set("end_date", params.endDate);
  const url = `${API_BASE}/events${qs.toString() ? `?${qs.toString()}` : ""}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.status}`);
  }
  return response.json();
}

export async function createEvent(payload: CreateNotableEventPayload): Promise<NotableEvent> {
  const response = await fetch(`${API_BASE}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      date: payload.date,
      title: payload.title,
      description: payload.description ?? null,
      category: payload.category ?? null,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create event: ${response.status}`);
  }

  return response.json();
}

export async function deleteEvent(eventId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/events/${eventId}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error(`Failed to delete event: ${response.status}`);
  }
}

export async function fetchWeeklyDashboard(): Promise<WeeklyDashboardResponse> {
  const response = await fetch(`${API_BASE}/dashboard/weekly`);
  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard: ${response.status}`);
  }
  return response.json();
}

