import { DayLogApiResponse } from "../types/dayLog";
import type {
  DailySummaryApiResponse,
  DailySummaryUpsertPayload,
} from "../types/dailySummary";
import type { CreateNotableEventPayload, NotableEvent } from "../types/events";
import type { WeeklyDashboardResponse } from "../types/dashboard";
import { signalApiFailure, signalApiSuccess } from "./pwaClient";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

async function request(
  url: string,
  options: RequestInit | undefined,
  failureLabel: string
): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      signalApiFailure();
      throw new Error(`${failureLabel}: ${response.status}`);
    }
    signalApiSuccess();
    return response;
  } catch (err) {
    signalApiFailure();
    throw err;
  }
}

export async function fetchDayLog(dateString: string): Promise<DayLogApiResponse> {
  const response = await request(
    `${API_BASE}/day-log/${dateString}`,
    undefined,
    "Failed to fetch"
  );
  return response.json();
}

export async function saveDayLog(dateString: string, hours: number[]): Promise<void> {
  await request(
    `${API_BASE}/day-log/${dateString}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hours }),
    },
    "Failed to save"
  );
}

export async function fetchDailySummary(
  dateString: string
): Promise<DailySummaryApiResponse> {
  const response = await request(
    `${API_BASE}/daily-summary/${dateString}`,
    undefined,
    "Failed to fetch summary"
  );
  return response.json();
}

export async function saveDailySummary(
  dateString: string,
  payload: DailySummaryUpsertPayload
): Promise<void> {
  await request(
    `${API_BASE}/daily-summary/${dateString}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    "Failed to save summary"
  );
}

export async function fetchEvents(params?: {
  startDate?: string;
  endDate?: string;
}): Promise<NotableEvent[]> {
  const qs = new URLSearchParams();
  if (params?.startDate) qs.set("start_date", params.startDate);
  if (params?.endDate) qs.set("end_date", params.endDate);
  const url = `${API_BASE}/events${qs.toString() ? `?${qs.toString()}` : ""}`;

  const response = await request(url, undefined, "Failed to fetch events");
  return response.json();
}

export async function createEvent(payload: CreateNotableEventPayload): Promise<NotableEvent> {
  const response = await request(
    `${API_BASE}/events`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: payload.date,
        title: payload.title,
        description: payload.description ?? null,
        category: payload.category ?? null,
      }),
    },
    "Failed to create event"
  );

  return response.json();
}

export async function deleteEvent(eventId: string): Promise<void> {
  await request(
    `${API_BASE}/events/${eventId}`,
    { method: "DELETE" },
    "Failed to delete event"
  );
}

export async function fetchWeeklyDashboard(): Promise<WeeklyDashboardResponse> {
  const response = await request(
    `${API_BASE}/dashboard/weekly`,
    undefined,
    "Failed to fetch dashboard"
  );
  return response.json();
}

