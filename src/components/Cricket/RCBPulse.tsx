"use client";

import { useEffect, useState } from "react";

interface Standing {
  team: string; rank: number | null; played: number;
  wins: number; loss: number; points: number; nrr: string | null;
}
interface LiveMatch {
  name: string; status: string; teams: string[];
  score: { r: number; w: number; o: number; inning: string }[];
  venue: string; started: boolean; ended: boolean;
}
interface RCBData {
  iplActive: boolean;
  live:      LiveMatch | null;
  standing:  Standing  | null;
  lastMatch: { name: string; status: string; date: string } | null;
  nextMatch: { name: string; date: string; venue: string }  | null;
}

const RCB_RED  = "#E03A3E";
const RCB_GOLD = "#C8A951";

export function RCBPulse() {
  const [data, setData] = useState<RCBData | null>(null);

  useEffect(() => {
    fetch("/api/rcb")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ iplActive: false, live: null, standing: null, lastMatch: null, nextMatch: null }));
  }, []);

  if (!data || !data.iplActive) return null;

  const { live, standing, lastMatch, nextMatch } = data;
  const isLive = live && live.started && !live.ended;

  return (
    <div
      className="flex flex-wrap items-center gap-3 px-5 py-3 text-sm"
      style={{
        background:   "rgba(224,58,62,0.06)",
        borderBottom: "1px solid rgba(224,58,62,0.12)",
      }}
    >
      {/* Badge */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-lg">🏏</span>
        <span className="font-bold text-xs tracking-wide" style={{ color: RCB_RED }}>
          RCB · IPL
        </span>
      </div>

      {/* Live match */}
      {isLive && live && (
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full animate-pulse flex-shrink-0"
            style={{ background: RCB_RED }}
          />
          <span className="font-medium" style={{ color: "#1a1a2e" }}>
            LIVE
          </span>
          {live.score.map((s, i) => (
            <span key={i} className="text-xs" style={{ color: "#5C3A1E" }}>
              {s.inning.replace("Inning 1", "").replace("Inning 2", "").trim()}:{" "}
              <strong>{s.r}/{s.w}</strong> ({s.o} ov)
            </span>
          ))}
          <span className="text-xs" style={{ color: "#9CA3AF" }}>· {live.venue}</span>
        </div>
      )}

      {/* Match ended today */}
      {live && !isLive && live.ended && (
        <span className="text-xs" style={{ color: "#5C3A1E" }}>
          {live.status}
        </span>
      )}

      {/* Last match result (no live match) */}
      {!live && lastMatch && (
        <span className="text-xs" style={{ color: "#5C3A1E" }}>
          Last: {lastMatch.status}
        </span>
      )}

      {/* Separator */}
      <span style={{ color: "#E5E7EB" }}>·</span>

      {/* Standing */}
      {standing && (
        <div className="flex items-center gap-3 text-xs" style={{ color: "#5C3A1E" }}>
          {standing.rank && (
            <span>
              <strong style={{ color: RCB_GOLD }}>#{standing.rank}</strong> in table
            </span>
          )}
          <span>
            {standing.wins}W – {standing.loss}L
          </span>
          <span>
            <strong>{standing.points}</strong> pts
          </span>
          {standing.nrr && <span>NRR {standing.nrr}</span>}
        </div>
      )}

      {/* Next match */}
      {nextMatch && !isLive && (
        <>
          <span style={{ color: "#E5E7EB" }}>·</span>
          <span className="text-xs" style={{ color: "#9CA3AF" }}>
            Next:{" "}
            {new Date(nextMatch.date).toLocaleDateString("en-IN", {
              weekday: "short", month: "short", day: "numeric",
            })}
          </span>
        </>
      )}
    </div>
  );
}
