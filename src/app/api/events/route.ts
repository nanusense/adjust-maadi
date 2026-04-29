import { NextResponse } from "next/server";

export const revalidate = 3600; // 1 hour

export interface LumaEvent {
  id: string;
  name: string;
  url: string;        // full https://lu.ma/... link
  startAt: string;    // ISO
  endAt: string;
  venue: string;      // city/venue label
  coverUrl: string | null;
}

export async function GET() {
  try {
    const res = await fetch(
      "https://api.lu.ma/discover/get-paginated-events?pagination_limit=20&geo=bengaluru",
      {
        next: { revalidate: 3600 },
        headers: { Accept: "application/json" },
      }
    );

    if (!res.ok) throw new Error(`Luma API ${res.status}`);

    const data = await res.json();

    const events: LumaEvent[] = (data.entries ?? [])
      .map((entry: Record<string, unknown>) => {
        const ev = entry.event as Record<string, unknown>;
        const geo = ev.geo_address_info as Record<string, string> | null;
        return {
          id: ev.api_id as string,
          name: ev.name as string,
          url: `https://lu.ma/${ev.url as string}`,
          startAt: ev.start_at as string,
          endAt: ev.end_at as string,
          venue: geo?.city_state ?? geo?.full_address ?? "Bengaluru",
          coverUrl: (ev.cover_url as string) ?? null,
        };
      })
      // Only future events (or starting within the next 7 days)
      .filter((ev: LumaEvent) => new Date(ev.endAt).getTime() > Date.now());

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Luma events error:", error);
    return NextResponse.json({ events: [] });
  }
}
