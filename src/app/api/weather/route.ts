import { NextResponse } from "next/server";

export const revalidate = 600; // 10 minutes

// Realistic Bengaluru climate data by month (avg min/max °C, humidity %)
const BENGALURU_CLIMATE: Record<number, { min: number; max: number; humidity: number; condition: string; desc: string; icon: string }> = {
  0:  { min: 15, max: 27, humidity: 62, condition: "Clear",  desc: "clear sky",          icon: "01d" }, // Jan
  1:  { min: 17, max: 29, humidity: 58, condition: "Clear",  desc: "clear sky",          icon: "01d" }, // Feb
  2:  { min: 20, max: 32, humidity: 52, condition: "Clear",  desc: "few clouds",         icon: "02d" }, // Mar
  3:  { min: 22, max: 34, humidity: 58, condition: "Clouds", desc: "scattered clouds",   icon: "03d" }, // Apr
  4:  { min: 21, max: 32, humidity: 68, condition: "Rain",   desc: "light rain",         icon: "10d" }, // May
  5:  { min: 19, max: 28, humidity: 78, condition: "Rain",   desc: "moderate rain",      icon: "10d" }, // Jun
  6:  { min: 19, max: 27, humidity: 80, condition: "Rain",   desc: "light rain",         icon: "10d" }, // Jul
  7:  { min: 19, max: 27, humidity: 82, condition: "Rain",   desc: "light rain",         icon: "10d" }, // Aug
  8:  { min: 19, max: 28, humidity: 78, condition: "Rain",   desc: "light rain",         icon: "10d" }, // Sep
  9:  { min: 18, max: 28, humidity: 72, condition: "Clouds", desc: "partly cloudy",      icon: "02d" }, // Oct
  10: { min: 17, max: 27, humidity: 65, condition: "Clear",  desc: "clear sky",          icon: "01d" }, // Nov
  11: { min: 15, max: 26, humidity: 62, condition: "Clear",  desc: "clear sky",          icon: "01d" }, // Dec
};

function getRealisticFallback() {
  const now = new Date();
  const month = now.getMonth();
  const hour = now.getHours();
  const climate = BENGALURU_CLIMATE[month];

  // Interpolate between min (5am) and max (2pm)
  const tempRange = climate.max - climate.min;
  let tempFraction: number;
  if (hour >= 5 && hour <= 14) {
    tempFraction = (hour - 5) / 9;
  } else if (hour > 14) {
    tempFraction = 1 - ((hour - 14) / 10);
  } else {
    tempFraction = 0.1;
  }
  const temp = Math.round(climate.min + tempRange * Math.max(0, tempFraction));

  // Use night icon after sunset
  const isNight = hour < 6 || hour > 19;
  const icon = isNight ? climate.icon.replace("d", "n") : climate.icon;

  return {
    weather: [{ main: climate.condition, description: climate.desc, icon }],
    main: { temp, feels_like: temp - 1, humidity: climate.humidity },
    wind: { speed: 3 + Math.floor(hour / 6) },
    fallback: true,
  };
}

export async function GET() {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  // No-cache headers for fallback responses so stale mock data never persists
  const noCache = { headers: { "Cache-Control": "no-store" } };

  if (!apiKey) {
    return NextResponse.json(getRealisticFallback(), noCache);
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=12.9716&lon=77.5946&appid=${apiKey}&units=metric`,
      { next: { revalidate: 600 } }
    );

    if (!res.ok) {
      console.error(`OpenWeatherMap returned ${res.status} - using climate fallback`);
      return NextResponse.json(getRealisticFallback(), noCache);
    }

    const data = await res.json();
    return NextResponse.json(data); // real data — cached 10 min via module revalidate
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(getRealisticFallback(), noCache);
  }
}
