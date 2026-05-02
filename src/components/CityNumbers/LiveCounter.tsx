"use client";

import { useEffect, useState, useRef } from "react";
import { getSecondsElapsedToday, getSecondsElapsedThisYear } from "@/lib/dates";
import { CityStat } from "@/lib/city-stats";

interface LiveCounterProps {
  stat: CityStat;
}

const colorMap: Record<string, string> = {
  amber: "#C67C2A",
  green: "#4A7A28",
  blue: "#2563EB",
  orange: "#EA580C",
  sky: "#0284C7",
  purple: "#7C3AED",
  gold: "#D4A843",
};

function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return Math.round(n).toLocaleString("en-IN");
  return Math.round(n).toLocaleString("en-IN");
}

function getInitialCount(stat: CityStat): number {
  if (stat.static) return 0;
  if (!stat.perSecond) return 0;

  const label = stat.label.toLowerCase();
  const isYearBased = label.includes("year");
  const elapsed = isYearBased ? getSecondsElapsedThisYear() : getSecondsElapsedToday();
  return stat.perSecond * elapsed;
}

export function LiveCounter({ stat }: LiveCounterProps) {
  const color = colorMap[stat.color] || "#C67C2A";
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initialCount = useRef(getInitialCount(stat));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
          setCount(initialCount.current);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted || stat.static || !stat.perSecond) return;

    const interval = setInterval(() => {
      setCount((prev) => prev + stat.perSecond!);
    }, 1000);

    return () => clearInterval(interval);
  }, [hasStarted, stat]);

  return (
    <div
      ref={ref}
      className="rounded p-5 transition-all duration-300 hover:scale-[1.02] cursor-default"
      style={{
        background: `${color}12`,
        border: `1px solid ${color}25`,
      }}
    >
      {/* Emoji */}
      <div className="text-3xl mb-3">{stat.emoji}</div>

      {/* Number */}
      <div
        className="counter-number font-lora font-bold leading-none mb-2"
        style={{
          fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
          color,
        }}
      >
        {stat.static ? (
          stat.static
        ) : hasStarted ? (
          formatNumber(count)
        ) : (
          <span className="opacity-30">...</span>
        )}
      </div>

      {/* Live indicator */}
      {stat.perSecond && (
        <div className="flex items-center gap-1.5 mb-2">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: color }}
          />
          <span className="text-xs font-medium" style={{ color }}>
            Live
          </span>
        </div>
      )}

      {/* Label */}
      <div className="text-xs leading-snug" style={{ color: "rgba(251, 245, 230, 0.75)" }}>
        {stat.label}
      </div>
    </div>
  );
}
