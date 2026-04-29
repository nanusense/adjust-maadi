"use client";

import { useState, useEffect } from "react";

export interface WeatherData {
  temp: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  cloudCover: number;   // %
  aqi: number | null;   // 1–5 OWM scale
  pm25: number | null;  // µg/m³
  uvIndex: number | null;
  icon: string;
  isRainy: boolean;
  isCloudy: boolean;
  positiveMessage: string;
}

function getPositiveMessage(temp: number, condition: string, isRainy: boolean): string {
  if (isRainy) return `${temp}°C and raining. Bengaluru's love language in full flow.`;
  if (temp < 20) return `A delightful ${temp}°C. The December chill Bangaloreans live for.`;
  if (temp <= 26) return `A perfect ${temp}°C. Bengaluru doing what it does best.`;
  if (temp <= 30) return `${temp}°C with ${condition.toLowerCase()}. Still one of India's best climates.`;
  return `${temp}°C in Bengaluru. Filter coffee weather, always.`;
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch("/api/weather");
        if (!res.ok) throw new Error("failed");
        const data = await res.json();

        const condition = data.weather?.[0]?.main || "Clear";
        const description = data.weather?.[0]?.description || "clear sky";
        const temp = Math.round(data.main?.temp || 24);
        const isRainy = /rain|drizzle|thunderstorm/i.test(condition);
        const isCloudy = /cloud/i.test(condition);

        setWeather({
          temp,
          feelsLike: Math.round(data.main?.feels_like ?? temp),
          condition,
          description,
          humidity: data.main?.humidity ?? 60,
          windSpeed: Math.round((data.wind?.speed ?? 3) * 3.6),
          cloudCover: data.clouds?.all ?? 0,
          aqi: data.aqi ?? null,
          pm25: data.pm25 ?? null,
          uvIndex: data.uvIndex ?? null,
          icon: data.weather?.[0]?.icon || "01d",
          isRainy,
          isCloudy,
          positiveMessage: getPositiveMessage(temp, condition, isRainy),
        });
      } catch {
        setWeather({
          temp: 24, feelsLike: 24, condition: "Clear", description: "clear sky",
          humidity: 65, windSpeed: 12, cloudCover: 20,
          aqi: null, pm25: null, uvIndex: null,
          icon: "01d", isRainy: false, isCloudy: false,
          positiveMessage: "A beautiful day in Bengaluru.",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { weather, loading };
}
