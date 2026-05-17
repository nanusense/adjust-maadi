import { NextResponse } from "next/server";

// Always fresh — events are time-sensitive; upstream Luma fetch is cached 30 min
export const dynamic = "force-dynamic";

export interface LumaEvent {
  id: string;
  name: string;
  url: string;        // full https://lu.ma/... link
  startAt: string;    // ISO
  endAt: string;
  venue: string;      // city/venue label
  coverUrl: string | null;
}

// Bengaluru bounding box — filter after fetch so Vercel's US IP doesn't skew results
const BLR_LAT = { min: 12.7, max: 13.2 };
const BLR_LON = { min: 77.3, max: 77.9 };

function isBengaluruEvent(geo: Record<string, unknown> | null, coordinate: { latitude?: number; longitude?: number } | null): boolean {
  if (!geo && !coordinate) return false;

  // Coordinate check (most reliable)
  if (coordinate?.latitude && coordinate?.longitude) {
    return (
      coordinate.latitude  >= BLR_LAT.min && coordinate.latitude  <= BLR_LAT.max &&
      coordinate.longitude >= BLR_LON.min && coordinate.longitude <= BLR_LON.max
    );
  }

  // Text fallback
  const text = JSON.stringify(geo ?? "").toLowerCase();
  return /bengaluru|bangalore|bengalore|karnataka/.test(text);
}

export async function GET() {
  try {
    const res = await fetch(
      // Use explicit lat/lon so results are location-correct from any server IP
      "https://api.lu.ma/discover/get-paginated-events?pagination_limit=50&latitude=12.9716&longitude=77.5946",
      {
        next: { revalidate: 1800 },
        headers: { Accept: "application/json" },
      }
    );

    if (!res.ok) throw new Error(`Luma API ${res.status}`);

    const data = await res.json();

    const events: LumaEvent[] = (data.entries ?? [])
      .filter((entry: Record<string, unknown>) => {
        const ev = entry.event as Record<string, unknown>;
        const geo = ev.geo_address_info as Record<string, unknown> | null;
        const coord = ev.coordinate as { latitude?: number; longitude?: number } | null;
        return isBengaluruEvent(geo, coord);
      })
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
      .filter((ev: LumaEvent) => {
        // Show only events that START today or tomorrow (IST).
        // Filter on startAt so stale-cached responses can't surface past events.
        const istOffsetMs = 5.5 * 60 * 60 * 1000;
        const nowIST = Date.now() + istOffsetMs;
        // Midnight today (IST) expressed as UTC ms
        const todayStartUTC = nowIST - (nowIST % (24 * 60 * 60 * 1000)) - istOffsetMs;
        const tomorrowEndUTC = todayStartUTC + 2 * 24 * 60 * 60 * 1000;

        const startUTC = new Date(ev.startAt).getTime();
        return startUTC >= todayStartUTC && startUTC < tomorrowEndUTC;
      });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Luma events error:", error);
    return NextResponse.json({ events: [] });
  }
}
