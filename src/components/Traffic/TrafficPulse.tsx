"use client";

import { useState, useEffect } from "react";
import { TRAFFIC_CORRIDORS, TRAFFIC_TIPS, TrafficCorridor } from "@/lib/bangalore-traffic";
import { AlertTriangle, Clock, Navigation, Train } from "lucide-react";

function getCurrentHour() {
  return new Date().getHours();
}

function getCorridorStatus(corridor: TrafficCorridor, hour: number): "jammed" | "heavy" | "clear" {
  const inPeak = corridor.peakHours.some(([start, end]) => hour >= start && hour < end);
  if (!inPeak) return "clear";
  return corridor.severity === "severe" ? "jammed" : "heavy";
}

const STATUS_CONFIG = {
  jammed: { label: "Jammed", dot: "#EF4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" },
  heavy:  { label: "Heavy",  dot: "#F97316", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.2)" },
  clear:  { label: "Clear",  dot: "#16a34a", bg: "rgba(22,163,74,0.08)",  border: "rgba(22,163,74,0.2)" },
};

export function TrafficPulse() {
  const [hour, setHour] = useState(getCurrentHour());
  const [selected, setSelected] = useState<TrafficCorridor | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setHour(getCurrentHour()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const currentTip = TRAFFIC_TIPS.find((t) => {
    if (t.time === "Before 7am") return hour < 7;
    if (t.time === "After 9pm") return hour >= 21;
    const [start, end] = t.time.split(" – ").map((s) => parseInt(s));
    return hour >= start && hour < end;
  }) || TRAFFIC_TIPS[3];

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-lg"
      style={{ border: "1px solid rgba(45,80,22,0.1)", background: "#FEFCF8" }}
    >
      {/* Header */}
      <div className="px-5 py-4" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)" }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs tracking-widest uppercase mb-0.5" style={{ color: "#D4A843" }}>
              Live · Updates every minute
            </div>
            <h3 className="font-lora text-xl font-bold text-white">Namma Traffic</h3>
          </div>
          <div
            className="text-right px-3 py-2 rounded-xl"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <div className="text-2xl">{currentTip.icon}</div>
            <div className="text-xs font-semibold mt-0.5" style={{ color: currentTip.label === "Peak Chaos" || currentTip.label === "Evening Rush" ? "#EF4444" : currentTip.label === "Easing Off" ? "#F97316" : "#16a34a" }}>
              {currentTip.label}
            </div>
          </div>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
          {currentTip.tip}
        </p>
      </div>

      {/* Corridor list */}
      <div className="divide-y" style={{ borderColor: "rgba(45,80,22,0.06)" }}>
        {TRAFFIC_CORRIDORS.map((corridor) => {
          const status = getCorridorStatus(corridor, hour);
          const cfg = STATUS_CONFIG[status];
          const isSelected = selected?.name === corridor.name;

          return (
            <div key={corridor.name}>
              <button
                className="w-full text-left px-5 py-3 transition-colors hover:bg-amber-50/50"
                onClick={() => setSelected(isSelected ? null : corridor)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="flex-shrink-0 w-2.5 h-2.5 rounded-full animate-pulse"
                      style={{ background: cfg.dot, animationPlayState: status === "clear" ? "paused" : "running" }}
                    />
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate" style={{ color: "#2D5016" }}>
                        {corridor.name}
                      </div>
                      <div className="text-xs truncate" style={{ color: "#8B7355" }}>
                        {corridor.from} → {corridor.to}
                      </div>
                    </div>
                  </div>
                  <span
                    className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: cfg.bg, color: cfg.dot, border: `1px solid ${cfg.border}` }}
                  >
                    {cfg.label}
                  </span>
                </div>
              </button>

              {/* Expanded tip */}
              {isSelected && (
                <div className="px-5 pb-4 space-y-2.5" style={{ background: "rgba(45,80,22,0.025)" }}>
                  <div className="flex items-start gap-2 text-xs" style={{ color: "#5C3A1E" }}>
                    <AlertTriangle size={12} className="mt-0.5 flex-shrink-0 text-amber-500" />
                    <span>{corridor.tip}</span>
                  </div>
                  {corridor.metroAlternative && (
                    <div className="flex items-start gap-2 text-xs" style={{ color: "#2D5016" }}>
                      <Train size={12} className="mt-0.5 flex-shrink-0" />
                      <span><strong>Metro:</strong> {corridor.metroAlternative}</span>
                    </div>
                  )}
                  {corridor.alternateRoute && (
                    <div className="flex items-start gap-2 text-xs" style={{ color: "#2D5016" }}>
                      <Navigation size={12} className="mt-0.5 flex-shrink-0" />
                      <span><strong>Alternate:</strong> {corridor.alternateRoute}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2 text-xs" style={{ color: "#8B7355" }}>
                    <Clock size={12} className="mt-0.5 flex-shrink-0" />
                    <span>
                      Peak hours: {corridor.peakHours.map(([s, e]) => {
                        const fmt = (h: number) => h === 0 ? "12am" : h < 12 ? `${h}am` : h === 12 ? "12pm" : `${h - 12}pm`;
                        return `${fmt(s)}–${fmt(e)}`;
                      }).join(" and ")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="px-5 py-3 text-xs text-center" style={{ color: "#8B7355", borderTop: "1px solid rgba(45,80,22,0.06)" }}>
        Based on historical Bangalore traffic patterns. Tap any corridor for tips.
      </div>
    </div>
  );
}
