"use client";

import { useState, useEffect } from "react";
import { TRAFFIC_CORRIDORS, TRAFFIC_TIPS, METRO_LINES, TrafficCorridor } from "@/lib/bangalore-traffic";
import { AlertTriangle, Clock, Navigation, Train, Zap } from "lucide-react";
import { useTraffic } from "@/hooks/useTraffic";

function getCurrentHour() {
  return new Date().getHours();
}

const STATUS_CONFIG = {
  severe:   { label: "JAMMED",   dot: "#EF4444", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.2)",  text: "#DC2626" },
  heavy:    { label: "HEAVY",    dot: "#F97316", bg: "rgba(249,115,22,0.08)",  border: "rgba(249,115,22,0.2)", text: "#EA580C" },
  moderate: { label: "MODERATE", dot: "#F59E0B", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.2)", text: "#D97706" },
  clear:    { label: "CLEAR",    dot: "#16a34a", bg: "rgba(22,163,74,0.08)",   border: "rgba(22,163,74,0.2)",  text: "#15803D" },
  jammed:   { label: "JAMMED",   dot: "#EF4444", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.2)",  text: "#DC2626" },
};

function staticSeverity(corridor: TrafficCorridor, hour: number): keyof typeof STATUS_CONFIG {
  const inPeak = corridor.peakHours.some(([s, e]) => hour >= s && hour < e);
  if (!inPeak) return "clear";
  return corridor.severity === "severe" ? "jammed" : "heavy";
}

function chunkPairs<T>(arr: T[]): T[][] {
  const pairs: T[][] = [];
  for (let i = 0; i < arr.length; i += 2) pairs.push(arr.slice(i, i + 2));
  return pairs;
}

export function TrafficPulse() {
  const [hour, setHour]         = useState(getCurrentHour());
  const [selected, setSelected] = useState<TrafficCorridor | null>(null);
  const { corridors: live, live: isLive } = useTraffic();

  useEffect(() => {
    const interval = setInterval(() => setHour(getCurrentHour()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const timeTip = TRAFFIC_TIPS.find((t) => {
    if (t.time === "Before 7am") return hour < 7;
    if (t.time === "After 9pm")  return hour >= 21;
    const [start, end] = t.time.split(" – ").map((s) => parseInt(s));
    return hour >= start && hour < end;
  }) || TRAFFIC_TIPS[3];

  const liveMap = new Map(live.map((c) => [c.name, c]));

  function getLiveTip() {
    if (!live.length) return timeTip;
    const counts = { severe: 0, heavy: 0, moderate: 0, clear: 0 };
    live.forEach((c) => { counts[c.liveSeverity] = (counts[c.liveSeverity] ?? 0) + 1; });
    const bad = counts.severe + counts.heavy;
    if (bad >= live.length * 0.6)
      return { icon: "🔴", label: "Heavy Traffic",   tip: "Multiple corridors are congested right now. Allow extra time for your journey." };
    if (bad >= live.length * 0.3)
      return { icon: "🟡", label: "Some Congestion", tip: "A few corridors are busy. Check your specific route before heading out." };
    return { icon: "🟢", label: "Roads Clear",      tip: "Most corridors are moving freely right now. Good time to travel." };
  }

  const currentTip = isLive ? getLiveTip() : timeTip;
  const pairs      = chunkPairs(TRAFFIC_CORRIDORS);
  const metroLines = METRO_LINES.filter((l) => l.status === "operational");

  return (
    <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.08)", background: "#FEFCF8" }}>

      {/* ── Header ── */}
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#C67C2A" }}>
              ಸಂಚಾರ
            </div>
            <h3 className="font-lora text-3xl font-bold leading-tight" style={{ color: "#1a1a2e" }}>
              Beat the <em>Rush</em>
            </h3>
          </div>
          <div className="text-right text-xs leading-relaxed mt-1" style={{ color: "#9CA3AF" }}>
            {isLive ? (
              <>
                <div className="flex items-center justify-end gap-1 font-medium" style={{ color: "#C67C2A" }}>
                  <Zap size={10} /> Live · Google Maps
                </div>
                <div>Updated every 10 min</div>
              </>
            ) : (
              <>
                <div>Pattern-based estimates</div>
                <div>Updated for time of day</div>
              </>
            )}
          </div>
        </div>

        {/* Current window pill */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.07)" }}
        >
          <span className="w-2 h-2 rounded-full flex-shrink-0 bg-green-500 animate-pulse" />
          <span className="text-xs" style={{ color: "#6B7280" }}>Current window:</span>
          <span className="text-xs font-medium" style={{ color: "#374151" }}>
            {currentTip.icon} {currentTip.label}
          </span>
        </div>
      </div>

      {/* ── Corridor grid — 2 columns ── */}
      <div className="border-t" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
        {pairs.map((pair, pairIdx) => {
          const selectedInPair = pair.find((c) => selected?.name === c.name);

          return (
            <div key={pairIdx}>
              {/* Two-column row */}
              <div className="grid grid-cols-2">
                {pair.map((corridor, colIdx) => {
                  const liveData    = liveMap.get(corridor.name);
                  const severityKey = liveData ? liveData.liveSeverity : staticSeverity(corridor, hour);
                  const cfg         = STATUS_CONFIG[severityKey] ?? STATUS_CONFIG.clear;
                  const isSelected  = selected?.name === corridor.name;

                  return (
                    <div
                      key={corridor.name}
                      className={colIdx === 1 ? "border-l" : ""}
                      style={{ borderColor: "rgba(0,0,0,0.07)" }}
                    >
                      <button
                        className="w-full text-left px-4 py-3 transition-colors hover:bg-amber-50/60"
                        onClick={() => setSelected(isSelected ? null : corridor)}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="flex-shrink-0 w-2.5 h-2.5 rounded-full"
                              style={{ background: cfg.dot }}
                            />
                            <div className="min-w-0">
                              <div className="font-semibold text-sm truncate" style={{ color: "#1a1a2e" }}>
                                {corridor.name}
                              </div>
                              <div className="text-xs truncate mt-0.5" style={{ color: "#9CA3AF" }}>
                                {corridor.from} → {corridor.to}
                                {liveData && (
                                  <span className="opacity-80">
                                    {" · "}{liveData.distanceKm} km{" · "}
                                    {liveData.ratio >= 0.95
                                      ? `${liveData.currentMins} min`
                                      : `Now ${liveData.currentMins} min`}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <span
                            className="flex-shrink-0 text-xs px-2 py-0.5 rounded font-semibold tracking-wide"
                            style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}
                          >
                            {liveData?.roadClosure ? "CLOSED" : cfg.label}
                          </span>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Expanded detail — full-width, below the row */}
              {selectedInPair && (() => {
                const corridor = selectedInPair;
                const liveData = liveMap.get(corridor.name);
                const fmt = (h: number) =>
                  h === 0 ? "12am" : h < 12 ? `${h}am` : h === 12 ? "12pm" : `${h - 12}pm`;

                return (
                  <div
                    className="px-5 py-3 space-y-2 border-t"
                    style={{ background: "rgba(245,158,11,0.03)", borderColor: "rgba(0,0,0,0.07)" }}
                  >
                    <div className="text-xs font-semibold mb-1" style={{ color: "#1a1a2e" }}>
                      {corridor.name}
                    </div>
                    {liveData && (
                      <div
                        className="text-xs py-1.5 px-3 rounded inline-block"
                        style={{ background: "rgba(45,80,22,0.06)", color: "#2D5016" }}
                      >
                        {liveData.ratio >= 0.95
                          ? <span>🚗 <strong>{liveData.currentMins} min</strong> · {liveData.distanceKm} km · moving freely</span>
                          : <span>🚗 Now <strong>{liveData.currentMins} min</strong> · Usually {liveData.typicalMins} min · <strong>+{liveData.currentMins - liveData.typicalMins} min delay</strong> · {liveData.distanceKm} km</span>
                        }
                      </div>
                    )}
                    <div className="flex items-start gap-1.5 text-xs" style={{ color: "#5C3A1E" }}>
                      <AlertTriangle size={11} className="mt-0.5 flex-shrink-0 text-amber-500" />
                      <span>{corridor.tip}</span>
                    </div>
                    {corridor.metroAlternative && (
                      <div className="flex items-start gap-1.5 text-xs" style={{ color: "#2D5016" }}>
                        <Train size={11} className="mt-0.5 flex-shrink-0" />
                        <span><strong>Metro:</strong> {corridor.metroAlternative}</span>
                      </div>
                    )}
                    {corridor.alternateRoute && (
                      <div className="flex items-start gap-1.5 text-xs" style={{ color: "#2D5016" }}>
                        <Navigation size={11} className="mt-0.5 flex-shrink-0" />
                        <span><strong>Alternate:</strong> {corridor.alternateRoute}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-1.5 text-xs" style={{ color: "#9CA3AF" }}>
                      <Clock size={11} className="mt-0.5 flex-shrink-0" />
                      <span>
                        Peak hours:{" "}
                        {corridor.peakHours.map(([s, e]) => `${fmt(s)}–${fmt(e)}`).join(" and ")}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Row divider */}
              <div className="border-t" style={{ borderColor: "rgba(0,0,0,0.07)" }} />
            </div>
          );
        })}
      </div>

      {/* ── Metro lines ── */}
      <div className="px-6 py-5">
        <div
          className="text-xs font-semibold tracking-widest uppercase mb-3"
          style={{ color: "#9CA3AF" }}
        >
          Namma Metro
        </div>
        <div className="grid grid-cols-2 gap-3">
          {metroLines.map((line) => (
            <div
              key={line.name}
              className="rounded-lg p-4"
              style={{ border: "1px solid rgba(0,0,0,0.08)", background: "#fff" }}
            >
              {/* Name + status */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: line.color }} />
                  <span className="font-semibold text-sm" style={{ color: "#1a1a2e" }}>{line.name}</span>
                </div>
                <span
                  className="text-xs font-semibold tracking-wide px-2 py-0.5 rounded"
                  style={{ background: "rgba(22,163,74,0.08)", color: "#15803D", border: "1px solid rgba(22,163,74,0.2)" }}
                >
                  OPERATIONAL
                </span>
              </div>

              {/* Route */}
              <div className="text-xs mb-3" style={{ color: "#6B7280" }}>
                {line.from} ↔ {line.to}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-1 text-center">
                {[
                  { val: String(line.stations), label: "STATIONS" },
                  { val: String(line.km),       label: "KM"       },
                  { val: line.fare,             label: "FARE RANGE" },
                  { val: line.firstTrain.replace(":00", ""), label: "FIRST TRAIN" },
                ].map(({ val, label }) => (
                  <div key={label}>
                    <div className="font-bold text-sm" style={{ color: "#1a1a2e" }}>{val}</div>
                    <div
                      className="mt-0.5 leading-tight"
                      style={{ color: "#9CA3AF", fontSize: "9px", letterSpacing: "0.03em" }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer note */}
              <div
                className="text-xs mt-3 pt-2 border-t"
                style={{ color: "#9CA3AF", borderColor: "rgba(0,0,0,0.06)", fontSize: "11px" }}
              >
                {line.interchangeAt.length > 0 && `Interchange at ${line.interchangeAt.join(", ")} · `}
                {line.frequency.split(" (")[0]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-6 py-3 text-xs text-center border-t"
        style={{ color: "#9CA3AF", borderColor: "rgba(0,0,0,0.07)" }}
      >
        {isLive
          ? "Live data from Google Maps · Updated every 10 min"
          : "Based on historical Bangalore traffic patterns"}
        {" · "}Tap any corridor for tips.
      </div>
    </div>
  );
}
