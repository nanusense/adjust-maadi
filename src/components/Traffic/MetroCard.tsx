"use client";

import { useState } from "react";
import { METRO_LINES, MetroLine } from "@/lib/bangalore-traffic";
import { Train, Clock, MapPin, Zap } from "lucide-react";

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

// Purely visual SVG schematic — no SVG text, all labels in HTML below
function MetroNetworkMap({ activeLine }: { activeLine: number }) {
  const PURPLE = "#7C3AED";
  const GREEN  = "#16a34a";
  const YELLOW = "#D4A843";
  const PINK   = "#EC4899";

  const opacity = (i: number) => (activeLine === i ? 1 : 0.2);

  return (
    <div className="px-4 pb-2 pt-3">
      {/* SVG — decorative only, aria-hidden */}
      <svg
        viewBox="0 0 300 158"
        className="w-full"
        style={{ height: 130 }}
        aria-hidden="true"
      >
        {/* Purple line (E–W) */}
        <line x1="14" y1="79" x2="286" y2="79"
          stroke={PURPLE} strokeWidth="6" strokeLinecap="round" opacity={opacity(0)} />

        {/* Green line (N–S) */}
        <line x1="143" y1="12" x2="143" y2="146"
          stroke={GREEN} strokeWidth="6" strokeLinecap="round" opacity={opacity(1)} />

        {/* Yellow line — dashed SE from near Majestic */}
        <line x1="143" y1="95" x2="284" y2="146"
          stroke={YELLOW} strokeWidth="5" strokeDasharray="7 5" strokeLinecap="round" opacity={opacity(2)} />

        {/* Pink line — dashed diagonal NE–SW */}
        <line x1="208" y1="24" x2="78" y2="146"
          stroke={PINK} strokeWidth="5" strokeDasharray="7 5" strokeLinecap="round" opacity={opacity(3)} />

        {/* Terminal dots — Purple */}
        <circle cx="14" cy="79" r="5" fill={PURPLE} opacity={opacity(0)} />
        <circle cx="286" cy="79" r="5" fill={PURPLE} opacity={opacity(0)} />

        {/* Terminal dots — Green */}
        <circle cx="143" cy="12" r="5" fill={GREEN} opacity={opacity(1)} />
        <circle cx="143" cy="146" r="5" fill={GREEN} opacity={opacity(1)} />

        {/* Terminal dots — Yellow */}
        <circle cx="143" cy="95" r="4" fill={YELLOW} opacity={opacity(2)} />
        <circle cx="284" cy="146" r="4" fill={YELLOW} opacity={opacity(2)} />

        {/* Terminal dots — Pink */}
        <circle cx="208" cy="24" r="4" fill={PINK} opacity={opacity(3)} />
        <circle cx="78" cy="146" r="4" fill={PINK} opacity={opacity(3)} />

        {/* Majestic interchange marker */}
        <circle cx="143" cy="79" r="11" fill="white" stroke="#1a1a2e" strokeWidth="3" />
        <circle cx="143" cy="79" r="5.5" fill="#1a1a2e" />
      </svg>

      {/* Readable HTML legend */}
      <div className="mt-1 space-y-1.5">
        {[
          { i: 0, color: PURPLE, label: "Purple", from: "Challaghatta", to: "Whitefield", dashed: false },
          { i: 1, color: GREEN,  label: "Green",  from: "Nagasandra",   to: "Silk Institute", dashed: false },
          { i: 2, color: YELLOW, label: "Yellow", from: "RV Road",      to: "Bommasandra", dashed: true },
          { i: 3, color: PINK,   label: "Pink",   from: "Kalena Agr.",  to: "Nagawara", dashed: true },
        ].map(({ i, color, label, from, to, dashed }) => (
          <div
            key={label}
            className="flex items-center gap-2 text-xs"
            style={{ opacity: activeLine === i ? 1 : 0.45 }}
          >
            {/* Color swatch */}
            <span
              className="flex-shrink-0 inline-block rounded-sm"
              style={{
                width: 20, height: 5,
                background: dashed
                  ? `repeating-linear-gradient(90deg, ${color} 0, ${color} 5px, transparent 5px, transparent 9px)`
                  : color,
              }}
            />
            <span style={{ color, fontWeight: 600 }}>{label}</span>
            <span style={{ color: "#8B7355" }}>{from}</span>
            <span style={{ color: "#C0A882" }}>↔</span>
            <span style={{ color: "#8B7355" }}>{to}</span>
            {dashed && (
              <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(107,114,128,0.1)", color: "#9CA3AF" }}>
                coming soon
              </span>
            )}
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-xs pt-0.5" style={{ color: "#6B7280" }}>
          <span
            className="inline-flex items-center justify-center w-4 h-4 rounded-full border-2 flex-shrink-0"
            style={{ borderColor: "#1a1a2e" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gray-800 block" />
          </span>
          Majestic — interchange station (Purple + Green)
        </div>
      </div>
    </div>
  );
}

// Dot-connected station route strip
function StationRoute({ line }: { line: MetroLine }) {
  const stations = line.keyStations;
  return (
    <div className="px-5 pb-4">
      <div className="flex items-center gap-1.5 text-xs font-medium mb-3" style={{ color: "#2D5016" }}>
        <MapPin size={11} /> Route ({line.km} km · {line.stations} stations)
      </div>
      <div className="relative">
        {/* Connecting line */}
        <div
          className="absolute left-[6px] top-[7px] bottom-[7px] w-0.5"
          style={{ background: `${line.color}35` }}
        />
        <div className="flex flex-col gap-1.5">
          {stations.map((station, i) => {
            const isFirst = i === 0;
            const isLast = i === stations.length - 1;
            const isInterchange = line.interchangeAt.includes(station);
            return (
              <div key={station} className="flex items-center gap-2.5 relative">
                {isInterchange ? (
                  <div
                    className="w-3 h-3 rounded-full border-2 flex-shrink-0 z-10"
                    style={{ background: "white", borderColor: line.color, boxShadow: `0 0 0 2px ${line.color}30` }}
                  />
                ) : (
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0 z-10"
                    style={{ background: isFirst || isLast ? line.color : `${line.color}55` }}
                  />
                )}
                <span
                  className="text-xs leading-tight"
                  style={{
                    color: isFirst || isLast || isInterchange ? "#2D1B0A" : "#7A5C3A",
                    fontWeight: isFirst || isLast || isInterchange ? 600 : 400,
                  }}
                >
                  {station}
                  {isInterchange && (
                    <span
                      className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full"
                      style={{ background: "#1a1a2e", color: "white" }}
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
  );
}

export function MetroCard() {
  const [activeLine, setActiveLine] = useState(0);
  const [showRoute, setShowRoute] = useState(false);
  const line = METRO_LINES[activeLine];

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-lg"
      style={{ border: "1px solid rgba(45,80,22,0.1)", background: "#FEFCF8" }}
    >
      {/* Header */}
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

      {/* Line tabs */}
      <div className="flex border-b" style={{ borderColor: "rgba(45,80,22,0.08)" }}>
        {METRO_LINES.map((l, i) => (
          <button
            key={l.name}
            onClick={() => { setActiveLine(i); setShowRoute(false); }}
            className="flex-1 py-2.5 text-xs font-medium transition-colors"
            style={{
              background: activeLine === i ? `${l.color}12` : "transparent",
              color: activeLine === i ? l.color : "#8B7355",
              borderBottom: activeLine === i ? `2px solid ${l.color}` : "2px solid transparent",
            }}
          >
            <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: l.color }} />
            {l.name.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Visual network map + HTML legend */}
      <MetroNetworkMap activeLine={activeLine} />

      {/* Stats row */}
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
              ? line.frequency.split(" ").slice(0, 2).join(" ")
              : "TBD"}
          </div>
          <div className="text-xs" style={{ color: "#8B7355" }}>Frequency</div>
        </div>
      </div>

      {/* Timings */}
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

      {/* Construction note */}
      {line.status === "construction" && (
        <div className="px-5 py-3" style={{ borderBottom: "1px solid rgba(45,80,22,0.06)" }}>
          <div
            className="text-xs px-3 py-2.5 rounded-xl leading-relaxed"
            style={{ background: "rgba(107,114,128,0.07)", color: "#5C5C5C" }}
          >
            🚧 Under construction. When complete: {line.connects.toLowerCase()}
          </div>
        </div>
      )}

      {/* Route toggle */}
      <div className="px-5 py-3">
        <button
          onClick={() => setShowRoute((v) => !v)}
          className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95"
          style={{
            background: `${line.color}12`,
            color: line.color,
            border: `1px solid ${line.color}30`,
          }}
        >
          <MapPin size={11} />
          {showRoute ? "Hide stations" : `Show key stations`}
        </button>
      </div>

      {/* Expandable station route */}
      {showRoute && (
        <div style={{ borderTop: "1px solid rgba(45,80,22,0.06)" }}>
          <StationRoute line={line} />
        </div>
      )}
    </div>
  );
}
