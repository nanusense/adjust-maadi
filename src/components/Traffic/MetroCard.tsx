"use client";

import { useState } from "react";
import { METRO_LINES, MetroLine } from "@/lib/bangalore-traffic";
import { Train, Clock, Zap } from "lucide-react";

function StatusBadge({ status }: { status: MetroLine["status"] }) {
  if (status === "operational")
    return (
      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(22,163,74,0.12)", color: "#16a34a" }}>
        Operational
      </span>
    );
  if (status === "partial")
    return (
      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(249,115,22,0.12)", color: "#F97316" }}>
        Partial
      </span>
    );
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(107,114,128,0.12)", color: "#6B7280" }}>
      Under Construction
    </span>
  );
}

function StationList({ line }: { line: MetroLine }) {
  return (
    <div style={{ borderTop: "1px solid rgba(45,80,22,0.06)" }}>
      {/* Header row */}
      <div className="px-5 pt-3 pb-2 flex items-center gap-2">
        <span className="text-xs font-semibold" style={{ color: "#2D5016" }}>All stations</span>
        {line.status === "construction" && (
          <span
            className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full"
            style={{ background: "rgba(107,114,128,0.1)", color: "#9CA3AF" }}
          >
            Under construction · planned
          </span>
        )}
      </div>

      {/* Scrollable station list */}
      <div className="px-5 pb-4 max-h-64 overflow-y-auto">
        <div className="relative">
          {/* Vertical track */}
          <div
            className="absolute top-2 bottom-2 w-0.5"
            style={{ left: 7, background: `${line.color}30` }}
          />
          <div className="space-y-1.5">
            {line.allStations.map((station, i) => {
              const isFirst      = i === 0;
              const isLast       = i === line.allStations.length - 1;
              const isInterchange = line.interchangeAt.includes(station);
              const isTerminal   = isFirst || isLast;

              return (
                <div key={station} className="flex items-center gap-3 relative">
                  {/* Dot */}
                  {isInterchange ? (
                    <div
                      className="w-[15px] h-[15px] rounded-full border-2 flex-shrink-0 z-10 bg-white"
                      style={{ borderColor: line.color, boxShadow: `0 0 0 3px ${line.color}20` }}
                    />
                  ) : (
                    <div
                      className="rounded-full flex-shrink-0 z-10"
                      style={{
                        width:      isTerminal ? 14 : 9,
                        height:     isTerminal ? 14 : 9,
                        marginLeft: isTerminal ? 0 : 3,
                        background: isTerminal ? line.color : `${line.color}65`,
                      }}
                    />
                  )}

                  {/* Label */}
                  <span
                    className="text-xs leading-tight"
                    style={{
                      color:      isTerminal || isInterchange ? "#2D1B0A" : "#7A5C3A",
                      fontWeight: isTerminal || isInterchange ? 600 : 400,
                    }}
                  >
                    {station}
                    {isInterchange && (
                      <span
                        className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full inline-block"
                        style={{ background: line.color, color: "white" }}
                      >
                        interchange
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MetroCard() {
  const [activeLine, setActiveLine] = useState(0);
  const line = METRO_LINES[activeLine];

  return (
    <div
      className="rounded overflow-hidden shadow-lg"
      style={{ border: "1px solid rgba(45,80,22,0.1)", background: "#FEFCF8" }}
    >
      {/* ── Coloured header ── */}
      <div className="px-5 py-4" style={{ background: line.color }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs tracking-widest uppercase mb-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>
              Namma Metro
            </div>
            <h3 className="font-lora text-xl font-bold text-white">{line.name}</h3>
          </div>
          <Train size={26} style={{ color: "rgba(255,255,255,0.75)" }} />
        </div>
        <div className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.85)" }}>
          {line.from} ↔ {line.to}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <StatusBadge status={line.status} />
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{line.km} km</span>
        </div>
        <p className="text-xs mt-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
          {line.connects}
        </p>
      </div>

      {/* ── Line tabs ── */}
      <div className="flex border-b" style={{ borderColor: "rgba(45,80,22,0.08)" }}>
        {METRO_LINES.map((l, i) => (
          <button
            key={l.name}
            onClick={() => setActiveLine(i)}
            className="flex-1 py-2.5 text-xs font-medium transition-colors"
            style={{
              background:   activeLine === i ? `${l.color}12` : "transparent",
              color:        activeLine === i ? l.color : "#8B7355",
              borderBottom: activeLine === i ? `2px solid ${l.color}` : "2px solid transparent",
            }}
          >
            <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: l.color }} />
            {l.name.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* ── All stations ── */}
      <StationList line={line} />

      {/* ── Stats row ── */}
      <div
        className="grid grid-cols-3 py-3"
        style={{ borderTop: "1px solid rgba(45,80,22,0.06)", borderBottom: "1px solid rgba(45,80,22,0.06)" }}
      >
        <div className="text-center px-2">
          <div className="font-bold text-lg" style={{ color: line.color }}>{line.stations}</div>
          <div className="text-xs" style={{ color: "#8B7355" }}>Stations</div>
        </div>
        <div
          className="text-center px-2"
          style={{ borderLeft: "1px solid rgba(45,80,22,0.06)", borderRight: "1px solid rgba(45,80,22,0.06)" }}
        >
          <div className="font-bold text-base" style={{ color: line.color }}>{line.fare}</div>
          <div className="text-xs" style={{ color: "#8B7355" }}>Fare range</div>
        </div>
        <div className="text-center px-2">
          <div className="font-bold text-sm leading-tight pt-1" style={{ color: line.color }}>
            {line.status === "operational"
              ? line.frequency.split(" ")[0]
              : "TBD"}
          </div>
          <div className="text-xs" style={{ color: "#8B7355" }}>Frequency</div>
        </div>
      </div>

      {/* ── Timings (operational only) ── */}
      {line.status === "operational" && (
        <div
          className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3"
          style={{ borderBottom: "1px solid rgba(45,80,22,0.06)" }}
        >
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "#5C3A1E" }}>
            <Clock size={12} />
            First: <strong>{line.firstTrain}</strong>
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "#5C3A1E" }}>
            <Clock size={12} />
            Last: <strong>{line.lastTrain}</strong>
          </div>
          {line.interchangeAt.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs" style={{ color: "#5C3A1E" }}>
              <Zap size={12} />
              Interchange: <strong>{line.interchangeAt.join(", ")}</strong>
            </div>
          )}
        </div>
      )}

      {/* ── Construction note ── */}
      {line.status === "construction" && (
        <div className="px-5 py-3" style={{ borderBottom: "1px solid rgba(45,80,22,0.06)" }}>
          <div
            className="text-xs px-3 py-2.5 rounded leading-relaxed"
            style={{ background: "rgba(107,114,128,0.07)", color: "#5C5C5C" }}
          >
            🚧 Under construction. When complete: {line.connects.toLowerCase()}
          </div>
        </div>
      )}
    </div>
  );
}
