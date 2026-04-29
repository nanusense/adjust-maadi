"use client";

import { Droplets, Wind, Thermometer, Sunrise, Sunset, Sparkles, Cloud, Sun } from "lucide-react";
import { WeatherData } from "@/hooks/useWeather";

interface WeatherCardProps {
  weather: WeatherData;
  sunrise?: string;
  sunset?: string;
  goldenHour?: string;
}

const conditionIcon: Record<string, string> = {
  Clear: "☀️", Clouds: "⛅", Rain: "🌧️", Drizzle: "🌦️",
  Thunderstorm: "⛈️", Snow: "❄️", Mist: "🌫️", Haze: "🌫️", Fog: "🌫️",
};

// AQI: OWM 1–5 → label + colour
const AQI_CONFIG = [
  { label: "Good",      color: "#16a34a", bg: "rgba(22,163,74,0.1)" },
  { label: "Fair",      color: "#65a30d", bg: "rgba(101,163,13,0.1)" },
  { label: "Moderate",  color: "#d97706", bg: "rgba(217,119,6,0.1)"  },
  { label: "Poor",      color: "#ea580c", bg: "rgba(234,88,12,0.1)"  },
  { label: "Very Poor", color: "#dc2626", bg: "rgba(220,38,38,0.1)"  },
];

// UV index → label + colour
function uvConfig(uv: number) {
  if (uv <= 2)  return { label: "Low",      color: "#16a34a", bg: "rgba(22,163,74,0.1)" };
  if (uv <= 5)  return { label: "Moderate", color: "#d97706", bg: "rgba(217,119,6,0.1)" };
  if (uv <= 7)  return { label: "High",     color: "#ea580c", bg: "rgba(234,88,12,0.1)" };
  if (uv <= 10) return { label: "Very High",color: "#dc2626", bg: "rgba(220,38,38,0.1)" };
  return              { label: "Extreme",   color: "#7c3aed", bg: "rgba(124,58,237,0.1)"};
}

// Cloud cover % → readable label
function cloudLabel(pct: number) {
  if (pct <= 10) return "Clear skies";
  if (pct <= 30) return "Mostly clear";
  if (pct <= 60) return "Partly cloudy";
  if (pct <= 85) return "Mostly cloudy";
  return "Overcast";
}

export function WeatherCard({ weather, sunrise, sunset, goldenHour }: WeatherCardProps) {
  const icon = conditionIcon[weather.condition] ?? "🌤️";
  const aqi = weather.aqi != null ? AQI_CONFIG[weather.aqi - 1] : null;
  const uv  = weather.uvIndex != null ? uvConfig(weather.uvIndex) : null;

  return (
    <div
      className="rounded-2xl p-5 max-w-sm w-full"
      style={{
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.5)",
        boxShadow: "0 4px 24px rgba(45,80,22,0.08)",
      }}
    >
      {/* Temp + condition */}
      <div className="flex items-start gap-4 mb-4">
        <span className="text-5xl leading-none" role="img" aria-label={weather.condition}>
          {icon}
        </span>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="font-lora text-5xl font-bold leading-none" style={{ color: "#2D5016" }}>
              {weather.temp}
            </span>
            <span className="text-2xl font-semibold" style={{ color: "#C67C2A" }}>°C</span>
          </div>
          <p className="font-lora text-sm italic mt-1 capitalize" style={{ color: "#5C3A1E" }}>
            {weather.description}
          </p>
        </div>
      </div>

      {/* Positive message */}
      <p
        className="text-sm leading-relaxed mb-4 italic"
        style={{ color: "#2D5016", borderLeft: "2px solid #C67C2A", paddingLeft: "0.75rem" }}
      >
        {weather.positiveMessage}
      </p>

      {/* Stats row 1 — feels like, humidity, wind */}
      <div className="flex gap-4 text-xs mb-2" style={{ color: "#5C3A1E" }}>
        <div className="flex items-center gap-1.5">
          <Thermometer size={13} style={{ color: "#EF4444" }} />
          <span>Feels {weather.feelsLike}°C</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Droplets size={13} style={{ color: "#3B82F6" }} />
          <span>{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wind size={13} style={{ color: "#6B7280" }} />
          <span>{weather.windSpeed} km/h</span>
        </div>
      </div>

      {/* Stats row 2 — cloud cover, AQI, UV */}
      <div className="flex flex-wrap gap-2 text-xs mb-4">
        {/* Cloud cover */}
        <div className="flex items-center gap-1.5" style={{ color: "#5C3A1E" }}>
          <Cloud size={13} style={{ color: "#6B7280" }} />
          <span>{cloudLabel(weather.cloudCover)}</span>
          <span style={{ color: "#9CA3AF" }}>({weather.cloudCover}%)</span>
        </div>

        {/* AQI badge */}
        {aqi && (
          <span
            className="flex items-center gap-1 px-2 py-0.5 rounded-full font-medium"
            style={{ background: aqi.bg, color: aqi.color }}
          >
            <Sun size={11} />
            AQI {aqi.label}
            {weather.pm25 != null && (
              <span className="opacity-70">· PM2.5 {Math.round(weather.pm25)}</span>
            )}
          </span>
        )}

        {/* UV badge */}
        {uv && weather.uvIndex != null && (
          <span
            className="flex items-center gap-1 px-2 py-0.5 rounded-full font-medium"
            style={{ background: uv.bg, color: uv.color }}
          >
            UV {Math.round(weather.uvIndex)} · {uv.label}
          </span>
        )}
      </div>

      {/* Sun times */}
      {(sunrise || sunset || goldenHour) && (
        <div
          className="border-t pt-3 flex gap-4 text-xs flex-wrap"
          style={{ borderColor: "rgba(198,124,42,0.18)", color: "#5C3A1E" }}
        >
          {sunrise && (
            <div className="flex items-center gap-1.5">
              <Sunrise size={13} style={{ color: "#F97316" }} />
              <span>{sunrise}</span>
            </div>
          )}
          {goldenHour && (
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} style={{ color: "#D4A843" }} />
              <span>Golden {goldenHour}</span>
            </div>
          )}
          {sunset && (
            <div className="flex items-center gap-1.5">
              <Sunset size={13} style={{ color: "#C67C2A" }} />
              <span>{sunset}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
