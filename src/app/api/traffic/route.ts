import { NextResponse } from "next/server";
import { TRAFFIC_CORRIDORS } from "@/lib/bangalore-traffic";

export const revalidate = 600; // 10 minutes

export interface LiveCorridor {
  name: string;
  currentSpeed: number;
  freeFlowSpeed: number;
  ratio: number;           // currentSpeed / freeFlowSpeed  (1.0 = free flow)
  liveSeverity: "severe" | "heavy" | "moderate" | "clear";
  roadClosure: boolean;
}

function speedToSeverity(ratio: number): LiveCorridor["liveSeverity"] {
  if (ratio >= 0.75) return "clear";
  if (ratio >= 0.50) return "moderate";
  if (ratio >= 0.30) return "heavy";
  return "severe";
}

export async function GET() {
  const key = process.env.TOMTOM_KEY;
  if (!key) return NextResponse.json({ corridors: [], live: false });

  try {
    const results = await Promise.all(
      TRAFFIC_CORRIDORS.map(async (corridor) => {
        const url =
          `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json` +
          `?point=${corridor.gps.lat},${corridor.gps.lon}&key=${key}`;

        const res = await fetch(url, { next: { revalidate: 600 } });
        if (!res.ok) return null;

        const data = await res.json();
        const seg = data.flowSegmentData;

        const currentSpeed  = seg.currentSpeed  as number;
        const freeFlowSpeed = seg.freeFlowSpeed as number;
        const ratio = freeFlowSpeed > 0 ? currentSpeed / freeFlowSpeed : 1;

        return {
          name:         corridor.name,
          currentSpeed,
          freeFlowSpeed,
          ratio:        Math.round(ratio * 100) / 100,
          liveSeverity: speedToSeverity(ratio),
          roadClosure:  seg.roadClosure as boolean,
        } satisfies LiveCorridor;
      })
    );

    const corridors = results.filter(Boolean) as LiveCorridor[];
    return NextResponse.json({ corridors, live: true, fetchedAt: new Date().toISOString() });
  } catch (error) {
    console.error("TomTom traffic error:", error);
    return NextResponse.json({ corridors: [], live: false });
  }
}
