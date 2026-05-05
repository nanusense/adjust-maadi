"use client";

import Image from "next/image";
import { getDayOfYear } from "@/lib/dates";
import { BANGALORE_ESCAPES } from "@/lib/bangalore-escapes";

export function WeekendEscape() {
  const escape = BANGALORE_ESCAPES[getDayOfYear() % BANGALORE_ESCAPES.length];

  return (
    <div
      className="rounded overflow-hidden shadow-lg"
      style={{ background: "#FFFFFF", border: "1px solid rgba(198,124,42,0.15)" }}
    >
      <div className="flex flex-col md:flex-row">
        {/* Left: photo */}
        <div className="relative md:w-72 h-56 md:h-auto flex-shrink-0 overflow-hidden">
          <Image
            src={escape.photo}
            alt={escape.name}
            fill
            className="object-cover"
            unoptimized
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&auto=format&fit=crop";
            }}
          />
          {/* Distance badge */}
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background: "rgba(0,0,0,0.55)", color: "#FBF5E6", backdropFilter: "blur(4px)" }}
          >
            {escape.distance}
          </div>
          {/* Drive time chip */}
          <div
            className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: "rgba(198,124,42,0.88)", color: "#FBF5E6" }}
          >
            🚗 {escape.driveTime}
          </div>
          {/* Big emoji overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ fontSize: "4rem", opacity: 0 }}
            aria-hidden
          >
            {escape.emoji}
          </div>
        </div>

        {/* Right: content */}
        <div className="p-6 flex flex-col justify-between flex-1">
          <div>
            {/* Region + season */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-xs tracking-widest uppercase" style={{ color: "#C67C2A" }}>
                {escape.emoji} {escape.region}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: "rgba(45,80,22,0.1)", color: "#2D5016" }}
              >
                Best: {escape.bestSeason}
              </span>
            </div>

            <h3 className="font-lora text-2xl font-bold leading-tight mb-0.5" style={{ color: "#2D5016" }}>
              {escape.name}
            </h3>
            <p className="font-kannada text-sm mb-3" style={{ color: "#8B7355" }}>
              {escape.kannada}
            </p>

            {/* Things to do */}
            <div className="flex flex-wrap gap-2 mb-4">
              {escape.thingsToDo.map((thing, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(198,124,42,0.08)", color: "#5C3A1E" }}
                >
                  {thing}
                </span>
              ))}
            </div>

            <p className="text-sm italic leading-relaxed mb-3" style={{ color: "#8B7355" }}>
              &ldquo;{escape.tagline}&rdquo;
            </p>

            <p className="text-sm leading-relaxed" style={{ color: "#5C3A1E" }}>
              {escape.fact}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
