"use client";

import Image from "next/image";
import { Sprout } from "lucide-react";
import { useDailyRotation } from "@/hooks/useDailyRotation";
import { BANGALORE_LAKES } from "@/lib/bangalore-lakes";

export function LakeOfTheDay() {
  const lake = useDailyRotation(BANGALORE_LAKES);

  return (
    <div className="rounded overflow-hidden shadow-xl group">
      {/* Photo */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src={lake.photo}
          alt={lake.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          unoptimized
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&auto=format&fit=crop";
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 photo-overlay" />
        {/* Lake badge */}
        <div className="absolute top-4 left-4">
          <span
            className="inline-block text-xs tracking-widest uppercase px-3 py-1 rounded-full"
            style={{
              background: "rgba(45, 80, 22, 0.8)",
              color: "#D4A843",
              backdropFilter: "blur(8px)",
            }}
          >
            Lake of the Day
          </span>
        </div>
        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div
            className="font-kannada text-xl mb-0.5"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            {lake.kannada}
          </div>
          <h3
            className="font-lora text-2xl md:text-3xl font-bold"
            style={{ color: "white" }}
          >
            {lake.name}
          </h3>
          <div
            className="text-sm mt-1"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            {lake.area}
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{ background: "#2D5016", padding: "1.25rem 1.5rem" }}>
        <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(251, 245, 230, 0.9)" }}>
          {lake.fact}
        </p>
        <div
          className="flex items-center gap-2 text-xs"
          style={{ color: "#D4A843" }}
        >
          <Sprout size={13} className="flex-shrink-0 mt-0.5" />
          <span>{lake.restoration}</span>
        </div>
      </div>
    </div>
  );
}
