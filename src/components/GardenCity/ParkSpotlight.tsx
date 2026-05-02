"use client";

import Image from "next/image";
import { Maximize2, CalendarDays, Clock3, Leaf } from "lucide-react";
import { useDailyRotation } from "@/hooks/useDailyRotation";
import { BANGALORE_PARKS } from "@/lib/bangalore-parks";

export function ParkSpotlight() {
  const park = useDailyRotation(BANGALORE_PARKS);

  return (
    <div className="warm-card overflow-hidden shadow-lg group">
      {/* Photo */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={park.photo}
          alt={park.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          unoptimized
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 photo-overlay" />
        <div className="absolute top-4 left-4">
          <span
            className="text-xs tracking-widest uppercase px-3 py-1 rounded-full"
            style={{
              background: "rgba(198, 124, 42, 0.8)",
              color: "white",
              backdropFilter: "blur(8px)",
            }}
          >
            Park Spotlight
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div
            className="font-kannada text-sm mb-0.5"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            {park.kannada}
          </div>
          <h3 className="font-lora text-xl font-bold text-white">{park.name}</h3>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex gap-4 text-xs mb-3" style={{ color: "#8B7355" }}>
          <span className="flex items-center gap-1">
            <Maximize2 size={11} />
            {park.area}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays size={11} />
            Est. {park.established}
          </span>
        </div>
        <p className="text-sm leading-relaxed mb-3" style={{ color: "#5C3A1E" }}>
          {park.fact}
        </p>
        <div
          className="flex items-start gap-2 text-xs p-3 rounded"
          style={{ background: "rgba(45, 80, 22, 0.06)", color: "#2D5016" }}
        >
          <Clock3 size={13} className="mt-0.5 flex-shrink-0" />
          <span><strong>Best time:</strong> {park.bestTime}</span>
        </div>
      </div>
    </div>
  );
}
