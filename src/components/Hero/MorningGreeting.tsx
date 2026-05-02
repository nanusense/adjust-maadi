"use client";

import { useEffect, useState } from "react";
import { getGreeting, formatTime } from "@/lib/dates";
import { useWeather } from "@/hooks/useWeather";
import { WeatherCard } from "./WeatherCard";
import { SkyGradient } from "./SkyGradient";

interface SunriseData {
  sunrise?: string;
  sunset?: string;
  goldenHour?: string;
}

export function MorningGreeting() {
  const { weather, loading } = useWeather();
  const [greeting, setGreeting] = useState(getGreeting());
  const [sunData, setSunData] = useState<SunriseData>({});
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata",
          hour12: true,
        })
      );
      setGreeting(getGreeting());
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch("/api/sunrise")
      .then((r) => r.json())
      .then((data) => {
        if (data.results) {
          // Golden hour ≈ 1 hour before sunset
          const sunsetDate = new Date(data.results.sunset);
          const goldenHourDate = new Date(sunsetDate.getTime() - 60 * 60 * 1000);
          setSunData({
            sunrise: formatTime(data.results.sunrise),
            sunset: formatTime(data.results.sunset),
            goldenHour: formatTime(goldenHourDate.toISOString()),
          });
        }
      })
      .catch(() => {});
  }, []);

  const isRainy = weather?.isRainy || false;
  const isCloudy = weather?.isCloudy || false;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Dynamic sky background */}
      <SkyGradient
        condition={weather?.condition || "Clear"}
        isRainy={isRainy}
        isCloudy={isCloudy}
      />

      {/* Huge Kannada watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="kannada-watermark"
          style={{
            fontSize: "clamp(5rem, 20vw, 22rem)",
            opacity: 0.06,
            color: isRainy ? "white" : "#2D5016",
            WebkitTextStroke: `1px ${isRainy ? "rgba(255,255,255,0.2)" : "rgba(45, 80, 22, 0.15)"}`,
          }}
        >
          ಬೆಂಗಳೂರು
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-start text-left px-8 py-20 gap-8 max-w-5xl mx-auto w-full">
        {/* Current time */}
        {currentTime && (
          <div
            className="fade-up-child stagger-1 text-sm tracking-[0.3em] uppercase"
            style={{ color: isRainy ? "rgba(255,255,255,0.7)" : "rgba(45, 80, 22, 0.7)" }}
          >
            {currentTime} · Bengaluru, Karnataka
          </div>
        )}

        {/* Greeting in Kannada */}
        <div className="fade-up-child stagger-2">
          <div
            className="font-kannada leading-tight mb-2"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 6rem)",
              fontWeight: 700,
              color: isRainy ? "white" : "#2D5016",
              textShadow: isRainy ? "0 2px 20px rgba(0,0,0,0.3)" : "none",
            }}
          >
            {greeting.kannada}
          </div>
          <div
            className="font-lora italic"
            style={{
              fontSize: "clamp(1rem, 3vw, 1.8rem)",
              color: isRainy ? "rgba(255,255,255,0.85)" : "#C67C2A",
              letterSpacing: "0.05em",
            }}
          >
            {greeting.english}, Bengaluru
          </div>
        </div>

        {/* Special rainy day message */}
        {isRainy && (
          <div className="fade-up-child stagger-3">
            <div
              className="glass-warm rounded px-6 py-3 text-sm font-medium"
              style={{ color: "#2D5016", maxWidth: "400px" }}
            >
              🌧️ Bengaluru rain: the city&apos;s love language, falling freely for all who call this home
            </div>
          </div>
        )}

        {/* Weather card */}
        <div className="fade-up-child stagger-4">
          {loading ? (
            <div
              className="glass-warm rounded p-5 max-w-sm w-full animate-pulse"
              style={{ height: "180px" }}
            />
          ) : weather ? (
            <WeatherCard
              weather={weather}
              sunrise={sunData.sunrise}
              sunset={sunData.sunset}
              goldenHour={sunData.goldenHour}
            />
          ) : null}
        </div>

        {/* Hero intro + scroll hint */}
        <div
          className="fade-up-child stagger-5 glass-warm rounded px-6 py-5 max-w-sm text-left"
          style={{
            background: isRainy ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.45)",
            border: isRainy ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(198,124,42,0.15)",
          }}
        >
          <p
            className="font-lora italic text-sm leading-relaxed"
            style={{ color: isRainy ? "rgba(255,255,255,0.85)" : "rgba(45,80,22,0.7)" }}
          >
            Bengaluru is chaotic, complicated, and occasionally infuriating.
            It is also extraordinary. This is a small record of what makes it worth it.
          </p>
          <div className="mt-4 flex flex-col items-start gap-1.5">
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: isRainy ? "rgba(255,255,255,0.45)" : "rgba(45,80,22,0.4)" }}
            >
              Scroll to explore
            </span>
            <div
              className="w-px h-6"
              style={{
                background: isRainy
                  ? "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)"
                  : "linear-gradient(to bottom, rgba(45,80,22,0.3), transparent)",
              }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
