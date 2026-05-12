"use client";

import { useEffect, useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_CRICKETDATA_KEY;
const BASE    = "https://api.cricketdata.org/v2";

const RCB_NAMES = ["royal challengers bengaluru", "royal challengers bangalore", "rcb"];
const isRCB = (s: string) => RCB_NAMES.some(n => s.toLowerCase().includes(n.slice(0, 12)));

interface Score  { r: number; w: number; o: number; inning: string }
interface Match  { name: string; status: string; teams: string[]; score: Score[]; venue: string; matchStarted: boolean; matchEnded: boolean; dateTimeGMT: string; series_id?: string }
interface Row    { team?: string; teamName?: string; pos?: number; rank?: number; played?: number; matchesPlayed?: number; won?: number; wins?: number; lost?: number; loss?: number; pts?: number; points?: number; nrr?: string }

async function cd<T>(path: string): Promise<T> {
  const r = await fetch(`${BASE}${path}&apikey=${API_KEY}`);
  const j = await r.json();
  if (j.status !== "success") throw new Error(j.reason ?? "API error");
  return j.data as T;
}

function rcbRow(table: any): Row | null {
  const rows: Row[] = Array.isArray(table)
    ? table.flatMap((g: any) => g.points ?? g)
    : [];
  return rows.find(r => isRCB(r.team ?? r.teamName ?? "")) ?? null;
}

export function RCBPulse() {
  const [state, setState] = useState<"loading" | "hidden" | "ready">("loading");
  const [live,      setLive]      = useState<Match  | null>(null);
  const [standing,  setStanding]  = useState<Row    | null>(null);
  const [lastMatch, setLastMatch] = useState<Match  | null>(null);
  const [nextMatch, setNextMatch] = useState<Match  | null>(null);

  useEffect(() => {
    if (!API_KEY) { setState("hidden"); return; }

    (async () => {
      try {
        // 1. Current matches → look for an active RCB / IPL match
        const matches = await cd<Match[]>("/currentMatches?offset=0");
        const rcbLive = matches.find(m =>
          (m.teams ?? []).some(t => isRCB(t)) && m.matchStarted && !m.matchEnded
        );
        const rcbAny  = matches.find(m => (m.teams ?? []).some(t => isRCB(t)));

        // 2. Find the IPL series (needed for standing + schedule)
        const series = await cd<any[]>("/series?offset=0");
        const ipl    = series.find(s => s.name?.toLowerCase().includes("indian premier league"));
        if (!ipl) { setState("hidden"); return; }

        // 3. Points table + series schedule in parallel
        const [tableRes, infoRes] = await Promise.allSettled([
          cd<any>(`/series_points_table?id=${ipl.id}`),
          cd<any>(`/series_info?id=${ipl.id}`),
        ]);

        const row = tableRes.status === "fulfilled" ? rcbRow(tableRes.value) : null;
        setStanding(row);

        // Parse schedule for last/next RCB match
        const matchList: Match[] = infoRes.status === "fulfilled"
          ? (infoRes.value?.matchList ?? infoRes.value ?? [])
          : [];
        const now    = Date.now();
        const rcbAll = matchList.filter(m => (m.teams ?? []).some(t => isRCB(t)));
        const past   = rcbAll.filter(m => new Date(m.dateTimeGMT).getTime() < now);
        const future = rcbAll.filter(m => new Date(m.dateTimeGMT).getTime() >= now);

        setLive(rcbLive ?? rcbAny ?? null);
        setLastMatch(past.at(-1) ?? null);
        setNextMatch(future[0]   ?? null);
        setState("ready");
      } catch (e) {
        console.error("RCBPulse:", e);
        setState("hidden");
      }
    })();
  }, []);

  if (state !== "ready") return null;
  if (!live && !standing && !nextMatch && !lastMatch) return null;

  const isLiveNow = live?.matchStarted && !live?.matchEnded;
  const RCB_RED   = "#E03A3E";
  const RCB_GOLD  = "#C8A951";

  return (
    <div
      className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-2.5 text-sm"
      style={{ background: "rgba(224,58,62,0.06)", borderBottom: "1px solid rgba(224,58,62,0.12)" }}
    >
      {/* Badge */}
      <span className="font-bold text-xs tracking-wide flex-shrink-0" style={{ color: RCB_RED }}>
        🏏 RCB · IPL
      </span>

      {/* Live score */}
      {isLiveNow && live && (
        <span className="flex items-center gap-1.5 text-xs" style={{ color: "#1a1a2e" }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: RCB_RED }} />
          <strong>LIVE</strong>
          {live.score.map((s, i) => (
            <span key={i} style={{ color: "#5C3A1E" }}>
              {s.inning.replace(/inning \d/i, "").trim() || "RCB"}: <strong>{s.r}/{s.w}</strong> ({s.o} ov)
            </span>
          ))}
        </span>
      )}

      {/* Match ended */}
      {live && !isLiveNow && live.matchEnded && (
        <span className="text-xs" style={{ color: "#5C3A1E" }}>{live.status}</span>
      )}

      {/* Last result (no live match) */}
      {!live && lastMatch && (
        <span className="text-xs" style={{ color: "#5C3A1E" }}>Last: {lastMatch.status}</span>
      )}

      {/* Standing */}
      {standing && (
        <span className="text-xs flex items-center gap-2" style={{ color: "#5C3A1E" }}>
          {standing.pos != null && (
            <strong style={{ color: RCB_GOLD }}>#{standing.pos ?? standing.rank}</strong>
          )}
          <span>{(standing.won ?? standing.wins ?? 0)}W–{(standing.lost ?? standing.loss ?? 0)}L</span>
          <span><strong>{standing.pts ?? standing.points ?? 0}</strong> pts</span>
          {standing.nrr && <span>NRR {standing.nrr}</span>}
        </span>
      )}

      {/* Next match */}
      {nextMatch && !isLiveNow && (
        <span className="text-xs" style={{ color: "#9CA3AF" }}>
          Next:{" "}
          {new Date(nextMatch.dateTimeGMT ?? nextMatch.date).toLocaleDateString("en-IN", {
            weekday: "short", month: "short", day: "numeric",
          })}
        </span>
      )}
    </div>
  );
}
