"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import Header from "../../components/Header";
import { createEvent, deleteEvent, fetchEvents } from "../../lib/api";
import { CATEGORIES } from "../../lib/categories";
import { todayString } from "../../lib/date";
import type { NotableEvent } from "../../types/events";

function groupByDate(events: NotableEvent[]): Record<string, NotableEvent[]> {
  return events.reduce<Record<string, NotableEvent[]>>((acc, ev) => {
    acc[ev.date] = acc[ev.date] ?? [];
    acc[ev.date].push(ev);
    return acc;
  }, {});
}

export default function EventsPage() {
  const [events, setEvents] = useState<NotableEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [date, setDate] = useState<string>(todayString());
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>(""); // "" = none

  const grouped = useMemo(() => groupByDate(events), [events]);
  const sortedDates = useMemo(
    () => Object.keys(grouped).sort((a, b) => (a < b ? 1 : -1)),
    [grouped]
  );

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const end = todayString();
      const start = new Date();
      start.setDate(start.getDate() - 29);
      const startStr = start.toISOString().slice(0, 10);
      const data = await fetchEvents({ startDate: startStr, endDate: end });
      setEvents(data);
    } catch (e) {
      console.error(e);
      setError("Could not load events. Backend may be offline.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = async () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const created = await createEvent({
        date,
        title: title.trim(),
        description: description.trim() ? description.trim() : null,
        category: category === "" ? null : Number(category),
      });
      setEvents((prev) => [created, ...prev]);
      setTitle("");
      setDescription("");
      setCategory("");
    } catch (e) {
      console.error(e);
      setError("Could not add event. Backend may be offline.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      console.error(e);
      setError("Could not delete event. Backend may be offline.");
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10 pt-[calc(1rem+env(safe-area-inset-top))] pb-[calc(1rem+env(safe-area-inset-bottom))]">
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
          <h2 className="text-sm font-medium text-zinc-300 mb-3">Add Notable Event</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs text-zinc-400 mb-2">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="One sentence is plenty"
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-xs text-zinc-400 mb-2">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="A little context, if you want"
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors resize-y"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-zinc-400 mb-2">Category (optional)</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
              >
                <option value="">None</option>
                {CATEGORIES.map((c, idx) => (
                  <option key={idx} value={idx}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 flex items-end">
              <button
                onClick={handleAdd}
                disabled={saving}
                className="w-full px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
              >
                {saving ? "Adding..." : "Add Event"}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-zinc-300">Notable Events</h2>
            <button
              onClick={load}
              disabled={loading}
              className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-50"
            >
              {loading ? "Loading…" : "Refresh"}
            </button>
          </div>

          {sortedDates.length === 0 ? (
            <div className="text-sm text-zinc-500">No events yet.</div>
          ) : (
            <div className="space-y-6">
              {sortedDates.map((d) => (
                <div key={d}>
                  <div className="text-xs text-zinc-500 mb-2">{d}</div>
                  <div className="space-y-2">
                    {grouped[d].map((ev) => {
                      const cat =
                        ev.category === null || ev.category === undefined
                          ? null
                          : CATEGORIES[ev.category];
                      return (
                        <div
                          key={ev.id}
                          className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-sm text-zinc-200 truncate">{ev.title}</div>
                              {cat && (
                                <div className="text-xs text-zinc-400 mt-1">
                                  <span className="mr-1">{cat.icon}</span>
                                  {cat.name}
                                </div>
                              )}
                              {ev.description && (
                                <div className="text-sm text-zinc-400 mt-2 whitespace-pre-wrap">
                                  {ev.description}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleDelete(ev.id)}
                              className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
                              title="Delete"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


