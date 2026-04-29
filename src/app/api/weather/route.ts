import { NextResponse } from "next/server";

export const revalidate = 600; // 10 minutes

const LAT = "12.9716";
const LON = "77.5946";

// Realistic Bengaluru climate data by month
const BENGALURU_CLIMATE: Record<number, { min: number; max: number; humidity: number; condition: string; desc: string; icon: string; clouds: number }> = {
  0:  { min: 15, max: 27, humidity: 62, condition: "Clear",  desc: "clear sky",        icon: "01d", clouds: 10 },
  1:  { min: 17, max: 29, humidity: 58, condition: "Clear",  desc: "clear sky",        icon: "01d", clouds: 15 },
  2:  { min: 20, max: 32, humidity: 52, condition: "Clear",  desc: "few clouds",       icon: "02d", clouds: 25 },
  3:  { min: 22, max: 34, humidity: 58, condition: "Clouds", desc: "scattered clouds", icon: "03d", clouds: 45 },
  4:  { min: 21, max: 32, humidity: 68, condition: "Rain",   desc: "light rain",       icon: "10d", clouds: 75 },
  5:  { min: 19, max: 28, humidity: 78, condition: "Rain",   desc: "moderate rain",    icon: "10d", clouds: 90 },
  6:  { min: 19, max: 27, humidity: 80, condition: "Rain",   desc: "light rain",       icon: "10d", clouds: 88 },
  7:  { min: 19, max: 27, humidity: 82, condition: "Rain",   desc: "light rain",       icon: "10d", clouds: 85 },
  8:  { min: 19, max: 28, humidity: 78, condition: "Rain",   desc: "light rain",       icon: "10d", clouds: 80 },
  9:  { min: 18, max: 28, humidity: 72, condition: "Clouds", desc: "partly cloudy",    icon: "02d", clouds: 40 },
  10: { min: 17, max: 27, humidity: 65, condition: "Clear",  desc: "clear sky",        icon: "01d", clouds: 15 },
  11: { min: 15, max: 26, humidity: 62, condition: "Clear",  desc: "clear sky",        icon: "01d", clouds: 10 },
};

function getRealisticFallback() {
  const now = new Date();
  const month = now.getMonth();
  const hour = now.getHours();
  const climate = BENGALURU_CLIMATE[month];

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
  const isNight = hour < 6 || hour > 19;
  const icon = isNight ? climate.icon.replace("d", "n") : climate.icon;

  return {
    weather: [{ main: climate.condition, description: climate.desc, icon }],
    main: { temp, feels_like: temp - 1, humidity: climate.humidity },
    wind: { speed: 3 + Math.floor(hour / 6) },
    clouds: { all: climate.clouds },
    aqi: null,
    uvIndex: null,
    fallback: true,
  };
}

export async function GET() {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  const noCache = { headers: { "Cache-Control": "no-store" } };

  if (!apiKey) return NextResponse.json(getRealisticFallback(), noCache);

  try {
    // Fetch weather, AQI, and UV in parallel
    const [weatherRes, aqiRes, uvRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${apiKey}&units=metric`, { next: { revalidate: 600 } }),
      fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${LAT}&lon=${LON}&appid=${apiKey}`, { next: { revalidate: 600 } }),
      fetch(`https://api.openweathermap.org/data/2.5/uvi?lat=${LAT}&lon=${LON}&appid=${apiKey}`, { next: { revalidate: 600 } }),
    ]);

    if (!weatherRes.ok) {
      console.error(`Weather API returned ${weatherRes.status}`);
      return NextResponse.json(getRealisticFallback(), noCache);
    }

    const [weather, aqiData, uvData] = await Promise.all([
      weatherRes.json(),
      aqiRes.ok ? aqiRes.json() : null,
      uvRes.ok ? uvRes.json() : null,
    ]);

    return NextResponse.json({
      ...weather,
      aqi: aqiData?.list?.[0]?.main?.aqi ?? null,         // 1–5
      pm25: aqiData?.list?.[0]?.components?.pm2_5 ?? null, // µg/m³
      uvIndex: uvData?.value ?? null,                       // 0–11+
    });
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(getRealisticFallback(), noCache);
  }
}
