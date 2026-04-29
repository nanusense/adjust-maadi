"use client";

import { useEvents } from "@/hooks/useEvents";
import { ExternalLink, MapPin, CalendarDays } from "lucide-react";

function formatEventDate(isoStart: string, isoEnd: string): string {
  const start = new Date(isoStart);
  const end = new Date(isoEnd);
  const opts: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
  };
  const timeOpts: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  const dateStr = start.toLocaleDateString("en-IN", opts);
  const timeStr = start.toLocaleTimeString("en-IN", timeOpts);

  // Multi-day event
  const startDay = start.toDateString();
  const endDay = end.toDateString();
  if (startDay !== endDay) {
    const endDate = end.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short" });
    return `${dateStr} – ${endDate}`;
  }
  return `${dateStr} · ${timeStr}`;
}

function isToday(isoStart: string): boolean {
  const start = new Date(isoStart);
  const now = new Date();
  return (
    start.getFullYear() === now.getFullYear() &&
    start.getMonth() === now.getMonth() &&
    start.getDate() === now.getDate()
  );
}

export function EventsSection() {
  const { events, loading } = useEvents();

  return (
    <section className="py-20 px-4" style={{ backgroundColor: "#F5EDD5" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-px flex-shrink-0" style={{ background: "#C67C2A" }} />
            <span className="text-xs tracking-[0.25em] uppercase font-medium" style={{ color: "#C67C2A" }}>
              What&apos;s On
            </span>
          </div>
          <h2 className="font-lora text-4xl md:text-5xl" style={{ color: "#2D5016" }}>
            Bengaluru Events
          </h2>
          <p className="mt-2 text-sm" style={{ color: "#8B7355" }}>
            Tech meetups, community talks &amp; startup events — from{" "}
            <a
              href="https://lu.ma/bengaluru"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-70"
              style={{ color: "#C67C2A" }}
            >
              Luma
            </a>
            . Cultural events coming soon.
          </p>
        </div>

        {/* Event grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl p-5 h-28"
                style={{ background: "rgba(45,80,22,0.05)" }}
              />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="text-sm italic" style={{ color: "#8B7355" }}>
            No upcoming events right now. Check{" "}
            <a href="https://lu.ma/bengaluru" target="_blank" rel="noopener noreferrer" className="underline">
              lu.ma/bengaluru
            </a>{" "}
            directly.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {events.map((event) => {
              const today = isToday(event.startAt);
              return (
                <a
                  key={event.id}
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative rounded-2xl p-5 flex flex-col gap-2 transition-all hover:-translate-y-0.5 hover:shadow-md"
                  style={{
                    background: "rgba(255,255,255,0.7)",
                    border: today
                      ? "1px solid rgba(198,124,42,0.4)"
                      : "1px solid rgba(45,80,22,0.08)",
                    boxShadow: "0 2px 12px rgba(45,80,22,0.04)",
                  }}
                >
                  {/* Today badge */}
                  {today && (
                    <span
                      className="absolute top-4 right-4 text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(198,124,42,0.12)", color: "#C67C2A" }}
                    >
                      Today
                    </span>
                  )}

                  {/* Event name */}
                  <p
                    className="text-sm font-semibold leading-snug pr-12 group-hover:underline underline-offset-2"
                    style={{ color: "#2D5016", textDecorationColor: "rgba(45,80,22,0.3)" }}
                  >
                    {event.name}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-col gap-1 mt-auto">
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: "#8B7355" }}>
                      <CalendarDays size={11} />
                      <span>{formatEventDate(event.startAt, event.endAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: "#8B7355" }}>
                      <MapPin size={11} />
                      <span className="truncate">{event.venue}</span>
                      <ExternalLink
                        size={10}
                        className="flex-shrink-0 ml-auto opacity-0 group-hover:opacity-40 transition-opacity"
                      />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex items-center gap-3 text-xs" style={{ color: "#9CA3AF" }}>
          <span>Powered by</span>
          <a
            href="https://lu.ma/bengaluru"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: "#C67C2A" }}
          >
            lu.ma/bengaluru
          </a>
          <span>·</span>
          <span>Updated hourly</span>
        </div>
      </div>
    </section>
  );
}
