import { NextResponse } from "next/server";

export const revalidate = 86400; // 24 hours

export async function GET() {
  try {
    const res = await fetch(
      "https://api.sunrise-sunset.org/json?lat=12.9716&lng=77.5946&formatted=0",
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) throw new Error("Sunrise API failed");

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({
      results: {
        sunrise: new Date().toISOString(),
        sunset: new Date().toISOString(),
        golden_hour: new Date().toISOString(),
      },
      status: "fallback",
    });
  }
}
