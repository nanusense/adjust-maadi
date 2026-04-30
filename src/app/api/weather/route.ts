import { NextResponse } from "next/server";

export const revalidate = 600; // 10 minutes

const LAT = "12.9716";
const LON = "77.5946";

// WMO weather code → condition + description
function wmoCondition(code: number): { condition: string; description: string; icon: string } {
  if (code === 0)              return { condition: "Clear",        description: "clear sky",        icon: "01d" };
  if (code === 1)              return { condition: "Clear",        description: "mainly clear",      icon: "01d" };
  if (code === 2)              return { condition: "Clouds",       description: "partly cloudy",     icon: "02d" };
  if (code === 3)              return { condition: "Clouds",       description: "overcast clouds",   icon: "04d" };
  if (code <= 48)              return { condition: "Fog",          description: "foggy",             icon: "50d" };
  if (code <= 55)              return { condition: "Drizzle",      description: "drizzle",           icon: "09d" };
  if (code <= 65)              return { condition: "Rain",         description: code <= 61 ? "light rain" : code <= 63 ? "moderate rain" : "heavy rain", icon: "10d" };
  if (code <= 75)              return { condition: "Snow",         description: "snow",              icon: "13d" };
  if (code <= 82)              return { condition: "Rain",         description: "rain showers",      icon: "09d" };
  if (code <= 86)              return { condition: "Snow",         description: "snow showers",      icon: "13d" };
  return                              { condition: "Thunderstorm", description: "thunderstorm",      icon: "11d" };
}

// Realistic Bengaluru climate fallback by month
const BENGALURU_CLIMATE: Record<number, { min: number; max: number; humidity: number; condition: string; desc: string; clouds: number }> = {
  0:  { min: 15, max: 27, humidity: 62, condition: "Clear",  desc: "clear sky",        clouds: 10 },
  1:  { min: 17, max: 29, humidity: 58, condition: "Clear",  desc: "clear sky",        clouds: 15 },
  2:  { min: 20, max: 32, humidity: 52, condition: "Clear",  desc: "few clouds",       clouds: 25 },
  3:  { min: 22, max: 34, humidity: 58, condition: "Clouds", desc: "scattered clouds", clouds: 45 },
  4:  { min: 21, max: 32, humidity: 68, condition: "Rain",   desc: "light rain",       clouds: 75 },
  5:  { min: 19, max: 28, humidity: 78, condition: "Rain",   desc: "moderate rain",    clouds: 90 },
  6:  { min: 19, max: 27, humidity: 80, condition: "Rain",   desc: "light rain",       clouds: 88 },
  7:  { min: 19, max: 27, humidity: 82, condition: "Rain",   desc: "light rain",       clouds: 85 },
  8:  { min: 19, max: 28, humidity: 78, condition: "Rain",   desc: "light rain",       clouds: 80 },
  9:  { min: 18, max: 28, humidity: 72, condition: "Clouds", desc: "partly cloudy",    clouds: 40 },
  10: { min: 17, max: 27, humidity: 65, condition: "Clear",  desc: "clear sky",        clouds: 15 },
  11: { min: 15, max: 26, humidity: 62, condition: "Clear",  desc: "clear sky",        clouds: 10 },
};

function getRealisticFallback() {
  const now = new Date();
  const month = now.getMonth();
  const hour = now.getHours();
  const climate = BENGALURU_CLIMATE[month];
  const tempRange = climate.max - climate.min;
  let tempFraction = hour >= 5 && hour <= 14 ? (hour - 5) / 9 : hour > 14 ? 1 - (hour - 14) / 10 : 0.1;
  const temp = Math.round(climate.min + tempRange * Math.max(0, tempFraction));
  return {
    weather: [{ main: climate.condition, description: climate.desc, icon: "01d" }],
    main: { temp, feels_like: temp - 1, humidity: climate.humidity },
    wind: { speed: 3 },
    clouds: { all: climate.clouds },
    aqi: null, pm25: null, dominentpol: null, uvIndex: null,
    fallback: true,
  };
}

export async function GET() {
  const waqiToken = process.env.WAQI_TOKEN;
  const noCache   = { headers: { "Cache-Control": "no-store" } };

  try {
    // Open-Meteo: free, no key, ECMWF model — replaces OWM for weather + UV
    const [omRes, waqiRes] = await Promise.all([
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
        `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,cloud_cover` +
        `&hourly=uv_index&wind_speed_unit=kmh&timezone=Asia%2FKolkata&forecast_days=1`,
        { next: { revalidate: 600 } }
      ),
      waqiToken
        ? fetch(`https://api.waqi.info/feed/bangalore/?token=${waqiToken}`, { next: { revalidate: 600 } })
        : Promise.resolve(null),
    ]);

    if (!omRes.ok) {
      console.error(`Open-Meteo returned ${omRes.status}`);
      return NextResponse.json(getRealisticFallback(), noCache);
    }

    const [omData, waqiData] = await Promise.all([
      omRes.json(),
      waqiRes && waqiRes.ok ? waqiRes.json() : null,
    ]);

    const current = omData.current;
    const { condition, description, icon } = wmoCondition(current.weather_code ?? 0);

    // UV: pick value for current hour from hourly array
    const currentHourIndex = new Date().getHours();
    const uvIndex = omData.hourly?.uv_index?.[currentHourIndex] ?? null;

    // WAQI AQI (Indian CPCB 0–500 scale)
    const aqiValue    = waqiData?.status === "ok" ? (waqiData.data?.aqi    ?? null) : null;
    const dominentpol = waqiData?.status === "ok" ? (waqiData.data?.dominentpol ?? null) : null;
    const pm25        = waqiData?.status === "ok" ? (waqiData.data?.iaqi?.pm25?.v ?? null) : null;

    return NextResponse.json({
      weather:  [{ main: condition, description, icon }],
      main: {
        temp:       Math.round(current.temperature_2m),
        feels_like: Math.round(current.apparent_temperature),
        humidity:   current.relative_humidity_2m,
      },
      wind:   { speed: (current.wind_speed_10m / 3.6) }, // km/h → m/s (hook multiplies back)
      clouds: { all: current.cloud_cover },
      aqi:        aqiValue,
      pm25,
      dominentpol,
      uvIndex,
    });
  } catch (error) {
    console.error("Weather fetch error:", error);
    return NextResponse.json(getRealisticFallback(), noCache);
  }
}
