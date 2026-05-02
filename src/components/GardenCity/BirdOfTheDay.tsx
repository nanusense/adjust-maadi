"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface BirdData {
  name: string;
  kannada: string;
  scientific: string;
  whereSeen: string;
  fact: string;
  photo: string | null;
  attribution: string | null;
}

export function BirdOfTheDay() {
  const [bird, setBird] = useState<BirdData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bird")
      .then((r) => r.json())
      .then(setBird)
      .catch(() => setBird(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        className="rounded overflow-hidden animate-pulse"
        style={{ background: "#E8F2EA", height: "220px" }}
      />
    );
  }

  if (!bird) return null;

  return (
    <div
      className="rounded overflow-hidden shadow-lg"
      style={{ background: "#FFFFFF", border: "1px solid rgba(45,80,22,0.1)" }}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Photo */}
        <div className="relative sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-[#E8F2EA]">
          {bird.photo ? (
            <Image
              src={bird.photo}
              alt={bird.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl">🐦</span>
            </div>
          )}
          {/* Kannada name overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 px-3 py-2"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}
          >
            <p className="font-kannada text-white text-sm leading-tight drop-shadow">
              {bird.kannada}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col justify-between flex-1">
          <div>
            <div className="text-xs tracking-widest uppercase mb-1" style={{ color: "#C67C2A" }}>
              🐦 Bird of the Day · iNaturalist
            </div>
            <h3 className="font-lora text-xl font-bold leading-tight mb-0.5" style={{ color: "#2D5016" }}>
              {bird.name}
            </h3>
            <p className="text-xs italic mb-3" style={{ color: "#8B7355" }}>{bird.scientific}</p>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#C67C2A" }}>
                  Where to spot it
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#5C3A1E" }}>
                  {bird.whereSeen}
                </p>
              </div>
              <div
                className="p-3 rounded text-sm leading-relaxed"
                style={{ background: "rgba(45,80,22,0.05)", color: "#5C3A1E" }}
              >
                ✦ {bird.fact}
              </div>
            </div>
          </div>

          {bird.attribution && (
            <p className="text-xs mt-3 truncate" style={{ color: "#9CA3AF" }}>
              Photo: {bird.attribution}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
