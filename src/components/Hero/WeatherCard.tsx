"use client";

import { Droplets, Wind, Thermometer, Sunrise, Sunset, Sparkles } from "lucide-react";
import { WeatherData } from "@/hooks/useWeather";

interface WeatherCardProps {
  weather: WeatherData;
  sunrise?: string;
  sunset?: string;
  goldenHour?: string;
}

const conditionIcon: Record<string, string> = {
  Clear: "☀️",
  Clouds: "⛅",
  Rain: "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Snow: "❄️",
  Mist: "🌫️",
  Haze: "🌫️",
  Fog: "🌫️",
};

export function WeatherCard({ weather, sunrise, sunset, goldenHour }: WeatherCardProps) {
  const icon = conditionIcon[weather.condition] || "🌤️";

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
        style={{
          color: "#2D5016",
          borderLeft: "2px solid #C67C2A",
          paddingLeft: "0.75rem",
        }}
      >
        {weather.positiveMessage}
      </p>

      {/* Stats row — Lucide icons */}
      <div className="flex gap-4 text-xs mb-4" style={{ color: "#5C3A1E" }}>
        <div className="flex items-center gap-1.5">
          <Droplets size={13} style={{ color: "#3B82F6" }} />
          <span>{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wind size={13} style={{ color: "#6B7280" }} />
          <span>{weather.windSpeed} km/h</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Thermometer size={13} style={{ color: "#EF4444" }} />
          <span>Feels {weather.feelsLike}°C</span>
        </div>
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
