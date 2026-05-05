"use client";

import { useEffect, useState } from "react";

interface AQIDay {
  date: string;
  label: string;
  pm25: number;
  aqi: number;
  category: string;
  color: string;
}

// Legend mirrors WeatherCard's aqiConfig exactly
const LEGEND: { label: string; color: string }[] = [
  { label: "Good",        color: "#16a34a" },
  { label: "Satisfactory",color: "#65a30d" },
  { label: "Moderate",    color: "#d97706" },
  { label: "Poor",        color: "#ea580c" },
  { label: "Very Poor",   color: "#dc2626" },
  { label: "Severe",      color: "#7c3aed" },
];

function today(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // YYYY-MM-DD
}

export function AQITrend() {
  const [days, setDays] = useState<AQIDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/aqi-history")
      .then((r) => r.json())
      .then((data) => setDays(data.days ?? []))
      .catch(() => setDays([]))
      .finally(() => setLoading(false));
  }, []);

  const todayStr = today();
  const maxAqi = days.length ? Math.max(...days.map((d) => d.aqi), 1) : 1;

  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.5)",
        boxShadow: "0 4px 24px rgba(45,80,22,0.08)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-xs font-semibold mb-0.5" style={{ color: "#2D5016" }}>
            Air Quality — 7-day trend
          </div>
          <div className="text-xs" style={{ color: "#8B7355" }}>
            AQI (0–500 scale) · same as weather tab
          </div>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(45,80,22,0.08)", color: "#2D5016" }}>
          Bengaluru
        </span>
      </div>

      {/* Bars */}
      {loading ? (
        <div className="flex items-end gap-2 h-28">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t animate-pulse"
              style={{ height: `${40 + i * 8}%`, background: "rgba(198,124,42,0.12)" }}
            />
          ))}
        </div>
      ) : days.length === 0 ? (
        <p className="text-sm italic" style={{ color: "#9CA3AF" }}>
          Air quality data unavailable right now.
        </p>
      ) : (
        <div className="flex items-end gap-1.5 h-28">
          {days.map((day) => {
            const isToday = day.date === todayStr;
            const heightPct = Math.max(8, Math.round((day.aqi / maxAqi) * 100));
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                {/* AQI value on top */}
                <span
                  className="tabular-nums font-semibold"
                  style={{ color: day.color, fontSize: "0.6rem" }}
                >
                  {day.aqi}
                </span>
                {/* Bar */}
                <div className="w-full flex flex-col justify-end" style={{ height: "5rem" }}>
                  <div
                    className="w-full rounded-t transition-all"
                    style={{
                      height: `${heightPct}%`,
                      background: day.color,
                      opacity: isToday ? 1 : 0.5,
                      outline: isToday ? `2px solid ${day.color}` : "none",
                      outlineOffset: "1px",
                    }}
                  />
                </div>
                {/* Day label */}
                <span
                  style={{
                    color: isToday ? day.color : "#8B7355",
                    fontWeight: isToday ? 700 : 400,
                    fontSize: "0.6rem",
                  }}
                >
                  {isToday ? "Today" : day.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-4 pt-3" style={{ borderTop: "1px solid rgba(198,124,42,0.12)" }}>
        {LEGEND.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
            <span style={{ color: "#8B7355", fontSize: "0.6rem" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
