"use client";

import { useState, useEffect } from "react";

export interface WeatherData {
  temp: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  isRainy: boolean;
  isCloudy: boolean;
  positiveMessage: string;
}

function getPositiveMessage(temp: number, condition: string, isRainy: boolean): string {
  if (isRainy) {
    return `${temp}°C and raining. Bengaluru's love language in full flow.`;
  }
  if (temp < 20) {
    return `A delightful ${temp}°C. The December chill Bangaloreans live for.`;
  }
  if (temp >= 20 && temp <= 26) {
    return `A perfect ${temp}°C. Bengaluru doing what it does best.`;
  }
  if (temp > 26 && temp <= 30) {
    return `${temp}°C with ${condition.toLowerCase()}. Still one of India's best climates.`;
  }
  return `${temp}°C in Bengaluru. Filter coffee weather, always.`;
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch("/api/weather");
        if (!res.ok) throw new Error("Weather fetch failed");
        const data = await res.json();

        const condition = data.weather?.[0]?.main || "Clear";
        const description = data.weather?.[0]?.description || "clear sky";
        const temp = Math.round(data.main?.temp || 24);
        const isRainy = condition.toLowerCase().includes("rain") || condition.toLowerCase().includes("drizzle");
        const isCloudy = condition.toLowerCase().includes("cloud");

        setWeather({
          temp,
          feelsLike: Math.round(data.main?.feels_like || temp),
          condition,
          description,
          humidity: data.main?.humidity || 60,
          windSpeed: Math.round((data.wind?.speed || 3) * 3.6),
          icon: data.weather?.[0]?.icon || "01d",
          isRainy,
          isCloudy,
          positiveMessage: getPositiveMessage(temp, condition, isRainy),
        });
      } catch {
        setError("Could not fetch weather, but trust us, it's beautiful in Bengaluru");
        setWeather({
          temp: 24,
          feelsLike: 24,
          condition: "Clear",
          description: "clear sky",
          humidity: 65,
          windSpeed: 12,
          icon: "01d",
          isRainy: false,
          isCloudy: false,
          positiveMessage: "A beautiful 24°C day. Bengaluru doing what it does best.",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { weather, loading, error };
}
