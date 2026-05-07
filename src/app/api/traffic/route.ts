import { NextResponse } from "next/server";
import { TRAFFIC_CORRIDORS } from "@/lib/bangalore-traffic";

export const revalidate = 600; // 10 minutes

export interface LiveCorridor {
  name: string;
  ratio: number;           // staticDuration / duration  (1.0 = free flow, 0.5 = twice as slow)
  typicalMins: number;     // usual travel time without traffic
  currentMins: number;     // current travel time with traffic
  liveSeverity: "severe" | "heavy" | "moderate" | "clear";
  roadClosure: boolean;
}

function ratioToSeverity(ratio: number): LiveCorridor["liveSeverity"] {
  if (ratio >= 0.75) return "clear";
  if (ratio >= 0.50) return "moderate";
  if (ratio >= 0.30) return "heavy";
  return "severe";
}

/** Parse Routes API duration string like "1800s" → seconds */
function parseDuration(d: string): number {
  return parseInt(d.replace("s", ""), 10) || 0;
}

export async function GET() {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return NextResponse.json({ corridors: [], live: false });

  try {
    const results = await Promise.all(
      TRAFFIC_CORRIDORS.map(async (corridor) => {
        const res = await fetch(
          "https://routes.googleapis.com/directions/v2:computeRoutes",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": key,
              // Only fetch the two fields we need — saves response size
              "X-Goog-FieldMask": "routes.duration,routes.staticDuration",
            },
            body: JSON.stringify({
              origin: {
                location: {
                  latLng: {
                    latitude:  corridor.origin.lat,
                    longitude: corridor.origin.lng,
                  },
                },
              },
              destination: {
                location: {
                  latLng: {
                    latitude:  corridor.destination.lat,
                    longitude: corridor.destination.lng,
                  },
                },
              },
              travelMode: "DRIVE",
              routingPreference: "TRAFFIC_AWARE",
            }),
            next: { revalidate: 600 },
          }
        );

        if (!res.ok) return null;
        const data = await res.json();
        const route = data.routes?.[0];
        if (!route) return null;

        const trafficSecs = parseDuration(route.duration);       // current travel time
        const freeSecs    = parseDuration(route.staticDuration); // without traffic

        // ratio: 1.0 = free flow, 0.5 = twice as slow
        const ratio = trafficSecs > 0 ? freeSecs / trafficSecs : 1;

        return {
          name:        corridor.name,
          ratio:       Math.round(ratio * 100) / 100,
          typicalMins: Math.round(freeSecs / 60),
          currentMins: Math.round(trafficSecs / 60),
          liveSeverity: ratioToSeverity(ratio),
          roadClosure: false,
        } satisfies LiveCorridor;
      })
    );

    const corridors = results.filter(Boolean) as LiveCorridor[];
    return NextResponse.json({ corridors, live: true, fetchedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Google Maps traffic error:", error);
    return NextResponse.json({ corridors: [], live: false });
  }
}
