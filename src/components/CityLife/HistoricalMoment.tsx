"use client";

import { findClosestHistoricalEvent } from "@/lib/dates";
import { BENGALURU_HISTORY } from "@/lib/neighbourhood-days";

export function HistoricalMoment() {
  const event = findClosestHistoricalEvent(BENGALURU_HISTORY);

  return (
    <div
      className="rounded-2xl p-6 shadow-lg overflow-hidden relative"
      style={{
        background: "linear-gradient(135deg, #FBF5E6 0%, #F0E6C8 100%)",
        border: "1px solid rgba(198, 124, 42, 0.2)",
      }}
    >
      {/* Decorative year */}
      {event.year && (
        <div
          className="absolute top-0 right-0 font-lora font-bold text-right pr-6 pt-4 select-none pointer-events-none"
          style={{
            fontSize: "clamp(3rem, 8vw, 6rem)",
            color: "rgba(198, 124, 42, 0.08)",
            lineHeight: 1,
          }}
        >
          {event.year}
        </div>
      )}

      <div className="relative z-10">
        <div
          className="text-xs tracking-widest uppercase mb-3 flex items-center gap-2"
          style={{ color: "#C67C2A" }}
        >
          <span>📜</span> From Bengaluru&apos;s History
        </div>

        <div className="flex items-start gap-3 mb-4">
          <div
            className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: "rgba(45, 80, 22, 0.08)" }}
          >
            {event.emoji || "🏛️"}
          </div>
          <div>
            <h3
              className="font-lora text-xl md:text-2xl font-bold leading-tight mb-1"
              style={{ color: "#2D5016" }}
            >
              {event.title}
            </h3>
            {event.year && (
              <div className="text-xs font-medium" style={{ color: "#C67C2A" }}>
                {event.year} · {event.month}/{event.day}
              </div>
            )}
          </div>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: "#5C3A1E" }}>
          {event.description}
        </p>

        <div
          className="mt-4 pt-4 text-xs italic"
          style={{ borderTop: "1px solid rgba(198, 124, 42, 0.15)", color: "#8B7355" }}
        >
          Every great city carries its history with pride. Bengaluru wears hers beautifully.
        </div>
      </div>
    </div>
  );
}
