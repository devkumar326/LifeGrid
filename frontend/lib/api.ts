import { DayLogApiResponse } from "../types/dayLog";

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

