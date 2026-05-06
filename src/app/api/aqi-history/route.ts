import { NextResponse } from "next/server";

export const revalidate = 3600; // 1 hour

const LAT = "12.9716";
const LON = "77.5946";

// Indian CPCB AQI categories — matches WeatherCard's aqiConfig
type AQICategory = "Good" | "Satisfactory" | "Moderate" | "Poor" | "Very Poor" | "Severe";

function getCategory(aqi: number): AQICategory {
  if (aqi <= 50)  return "Good";
  if (aqi <= 100) return "Satisfactory";
  if (aqi <= 200) return "Moderate";
  if (aqi <= 300) return "Poor";
  if (aqi <= 400) return "Very Poor";
  return "Severe";
}

// Colours match WeatherCard exactly
const CATEGORY_COLOR: Record<AQICategory, string> = {
  Good:         "#16a34a",
  Satisfactory: "#65a30d",
  Moderate:     "#d97706",
  Poor:         "#ea580c",
  "Very Poor":  "#dc2626",
  Severe:       "#7c3aed",
};

function dayLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00+05:30");
  return d.toLocaleDateString("en-IN", { weekday: "short", timeZone: "Asia/Kolkata" });
}

export async function GET() {
  try {
    // us_aqi is 0–500, same scale as CPCB/WAQI shown in the weather tab
    const url =
      `https://air-quality-api.open-meteo.com/v1/air-quality` +
      `?latitude=${LAT}&longitude=${LON}` +
      `&hourly=pm2_5,us_aqi` +
      `&past_days=7&timezone=Asia%2FKolkata`;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Open-Meteo AQ returned ${res.status}`);

    const data = await res.json();

    const times: string[] = data.hourly?.time    ?? [];
    const pm25s: number[] = data.hourly?.pm2_5   ?? [];
    const aqis:  number[] = data.hourly?.us_aqi  ?? [];

    // Group into calendar days (IST)
    const dayMap = new Map<string, { pm25Sum: number; aqiSum: number; count: number }>();

    for (let i = 0; i < times.length; i++) {
      const dateKey = times[i].slice(0, 10); // "YYYY-MM-DD"
      const pm25Val = pm25s[i];
      const aqiVal  = aqis[i];
      if (pm25Val == null || aqiVal == null) continue;

      const existing = dayMap.get(dateKey);
      if (existing) {
        existing.pm25Sum += pm25Val;
        existing.aqiSum  += aqiVal;
        existing.count   += 1;
      } else {
        dayMap.set(dateKey, { pm25Sum: pm25Val, aqiSum: aqiVal, count: 1 });
      }
    }

    // Today's date in IST (YYYY-MM-DD)
    const todayIST = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

    // Sort, drop any future forecast dates, take last 7 historical days
    const days = Array.from(dayMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .filter(([date]) => date <= todayIST)
      .slice(-7)
      .map(([date, { pm25Sum, aqiSum, count }]) => {
        const pm25     = Math.round(pm25Sum / count);
        const aqi      = Math.round(aqiSum  / count);
        const category = getCategory(aqi);
        return {
          date,
          label:    dayLabel(date),
          pm25,
          aqi,
          category,
          color: CATEGORY_COLOR[category],
        };
      });

    return NextResponse.json({ days, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error("AQI history fetch error:", error);
    return NextResponse.json({ days: [], updatedAt: new Date().toISOString() });
  }
}
