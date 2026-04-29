"use client";

import { useEffect, useRef, useState } from "react";

interface SkyGradientProps {
  condition: string;
  isRainy: boolean;
  isCloudy: boolean;
}

interface Particle {
  id: number;
  left: number;
  top?: number;
  delay: number;
  duration: number;
  height?: number;
  size?: number;
  opacity: number;
}

function makeStars(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 60,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 3,
    size: Math.random() > 0.7 ? 2 : 1,
    opacity: 0.3 + Math.random() * 0.6,
  }));
}

function makeRainDrops(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 0.8 + Math.random() * 0.6,
    height: 15 + Math.random() * 25,
    opacity: 0.3 + Math.random() * 0.4,
  }));
}

export function SkyGradient({ isRainy, isCloudy }: SkyGradientProps) {
  const [mounted, setMounted] = useState(false);
  const stars = useRef<Particle[]>([]);
  const rainDrops = useRef<Particle[]>([]);

  useEffect(() => {
    stars.current = makeStars(60);
    rainDrops.current = makeRainDrops(40);
    setMounted(true);
  }, []);

  const hour = new Date().getHours();
  const isNight = hour >= 21 || hour < 5;

  const getGradient = () => {
    if (isRainy) return "linear-gradient(to bottom, #1a3a5c 0%, #2d5a7b 30%, #4a7fa0 60%, #6ba3c0 100%)";
    if (isCloudy) return "linear-gradient(to bottom, #4a6b8c 0%, #7a9bb5 30%, #a8c0d0 60%, #c8d8e4 100%)";
    if (hour >= 5 && hour < 7)  return "linear-gradient(to bottom, #1a0a2e 0%, #4a2040 30%, #c67c2a 60%, #f0b050 100%)";
    if (hour >= 7 && hour < 11) return "linear-gradient(to bottom, #2080c0 0%, #60a8e0 40%, #90c8f0 70%, #b8d8f0 100%)";
    if (hour >= 11 && hour < 16) return "linear-gradient(to bottom, #1060b0 0%, #4090d0 40%, #70b8f0 70%, #90d0f8 100%)";
    if (hour >= 16 && hour < 19) return "linear-gradient(to bottom, #1a1a40 0%, #803020 30%, #c67c2a 55%, #d4a843 75%, #f0d080 100%)";
    if (hour >= 19 && hour < 21) return "linear-gradient(to bottom, #0a0a20 0%, #1a1a40 30%, #2a2060 60%, #403080 100%)";
    return "linear-gradient(to bottom, #020510 0%, #0a0a25 40%, #151530 70%, #1a1535 100%)";
  };

  return (
    <div className="absolute inset-0 transition-all duration-[3000ms]" style={{ background: getGradient() }}>
      {/* Stars - only after mount to avoid hydration mismatch */}
      {mounted && isNight && (
        <div className="absolute inset-0 pointer-events-none">
          {stars.current.map((star) => (
            <div
              key={star.id}
              className="absolute rounded-full bg-white"
              style={{
                width: star.size,
                height: star.size,
                left: `${star.left}%`,
                top: `${star.top}%`,
                opacity: star.opacity,
                animation: `pulse ${star.duration}s ease-in-out ${star.delay}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* Sun/moon glow */}
      {!isRainy && !isCloudy && (
        <div
          className="absolute rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{
            width: 300,
            height: 300,
            background: isNight ? "rgba(255,200,100,0.4)" : "rgba(255,220,80,0.5)",
            right: "10%",
            top: isNight ? "auto" : "5%",
            bottom: isNight ? "20%" : "auto",
          }}
        />
      )}

      {/* Cloud wisps */}
      {(isCloudy || isRainy) && (
        <>
          <div className="absolute rounded-full blur-2xl opacity-20 pointer-events-none"
            style={{ width: 400, height: 100, background: "white", left: "5%", top: "15%" }} />
          <div className="absolute rounded-full blur-2xl opacity-15 pointer-events-none"
            style={{ width: 350, height: 80, background: "white", right: "10%", top: "25%" }} />
        </>
      )}

      {/* Rain */}
      {mounted && isRainy && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {rainDrops.current.map((drop) => (
            <div
              key={drop.id}
              className="absolute"
              style={{
                left: `${drop.left}%`,
                top: "-20px",
                width: "1px",
                height: `${drop.height}px`,
                background: "linear-gradient(to bottom, transparent, rgba(180,220,255,0.5))",
                animation: `rainFall ${drop.duration}s linear ${drop.delay}s infinite`,
                opacity: drop.opacity,
              }}
            />
          ))}
        </div>
      )}

      {/* Bottom fade to cream */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(251,245,230,0.95))" }}
      />
    </div>
  );
}
