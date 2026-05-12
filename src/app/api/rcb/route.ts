import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_KEY = process.env.CRICKETDATA_KEY;
const BASE    = "https://api.cricketdata.org/v2";

const RCB_NAMES = [
  "Royal Challengers Bengaluru",
  "Royal Challengers Bangalore",
  "RCB",
];

function isRCB(name: string) {
  return RCB_NAMES.some((n) => name.toLowerCase().includes(n.toLowerCase().slice(0, 10)));
}

async function cdFetch(path: string) {
  const res = await fetch(`${BASE}${path}&apikey=${API_KEY}`, {
    next: { revalidate: 120 }, // cache 2 min server-side
  });
  if (!res.ok) throw new Error(`cricketdata ${path} → ${res.status}`);
  const json = await res.json();
  if (json.status !== "success") throw new Error(json.reason ?? "API error");
  return json.data;
}

export async function GET() {
  if (!API_KEY) {
    return NextResponse.json({ iplActive: false, error: "No API key" });
  }

  try {
    // 1. Fetch all current matches and find RCB ones
    const matches: any[] = await cdFetch("/currentMatches?offset=0");

    const rcbMatches = matches.filter((m: any) =>
      (m.teams ?? []).some((t: string) => isRCB(t)) &&
      (m.name?.includes("Indian Premier League") || m.series_id)
    );

    if (rcbMatches.length === 0) {
      // No active RCB/IPL matches — check if IPL series exists at all
      const seriesList: any[] = await cdFetch("/series?offset=0");
      const iplSeries = seriesList.find((s: any) =>
        s.name?.toLowerCase().includes("indian premier league")
      );
      if (!iplSeries) return NextResponse.json({ iplActive: false });

      // IPL is listed but RCB may have no match today — still show standing
      const [info, table] = await Promise.allSettled([
        cdFetch(`/series_info?id=${iplSeries.id}`),
        cdFetch(`/series_points_table?id=${iplSeries.id}`),
      ]);

      const standing = extractRCBStanding(
        table.status === "fulfilled" ? table.value : null
      );

      // Try to find last & next RCB match from series info
      const matchList: any[] =
        info.status === "fulfilled" ? (info.value?.matchList ?? []) : [];
      const { lastMatch, nextMatch } = extractLastAndNext(matchList);

      return NextResponse.json({
        iplActive: true,
        live: null,
        standing,
        lastMatch,
        nextMatch,
      });
    }

    // There IS an active RCB match
    const live = rcbMatches[0];
    const seriesId = live.series_id;

    const [table] = await Promise.allSettled([
      cdFetch(`/series_points_table?id=${seriesId}`),
    ]);

    const standing = extractRCBStanding(
      table.status === "fulfilled" ? table.value : null
    );

    return NextResponse.json({
      iplActive: true,
      live: {
        name:    live.name,
        status:  live.status,
        teams:   live.teams ?? [],
        score:   live.score ?? [],
        venue:   live.venue ?? "",
        started: live.matchStarted ?? false,
        ended:   live.matchEnded ?? false,
      },
      standing,
      lastMatch: null,
      nextMatch: null,
    });
  } catch (err: any) {
    console.error("RCB API error:", err.message);
    return NextResponse.json({ iplActive: false, error: err.message });
  }
}

function extractRCBStanding(table: any): any {
  if (!table) return null;
  // table may be an array of groups or direct array of teams
  const rows: any[] = Array.isArray(table)
    ? table.flatMap((g: any) => g.points ?? g)
    : [];
  const rcbRow = rows.find((r: any) => isRCB(r.team ?? r.teamName ?? ""));
  if (!rcbRow) return null;
  return {
    team:   rcbRow.team ?? rcbRow.teamName ?? "RCB",
    rank:   rcbRow.pos ?? rcbRow.rank ?? null,
    played: rcbRow.played ?? rcbRow.matchesPlayed ?? 0,
    wins:   rcbRow.won   ?? rcbRow.wins ?? 0,
    loss:   rcbRow.lost  ?? rcbRow.loss ?? 0,
    points: rcbRow.pts   ?? rcbRow.points ?? 0,
    nrr:    rcbRow.nrr ?? null,
  };
}

function extractLastAndNext(matchList: any[]) {
  const rcb = matchList.filter((m: any) =>
    (m.teams ?? []).some((t: string) => isRCB(t))
  );
  const now = Date.now();
  const past   = rcb.filter((m: any) => new Date(m.dateTimeGMT).getTime() < now);
  const future = rcb.filter((m: any) => new Date(m.dateTimeGMT).getTime() >= now);
  const last   = past.at(-1) ?? null;
  const next   = future[0]   ?? null;
  return {
    lastMatch: last ? { name: last.name, status: last.status, date: last.date } : null,
    nextMatch: next ? { name: next.name, date: next.date, venue: next.venue }   : null,
  };
}
