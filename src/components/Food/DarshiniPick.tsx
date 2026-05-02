"use client";

import { getDayOfYear } from "@/lib/dates";
import { BANGALORE_DARSHINIS } from "@/lib/bangalore-darshinis";

export function DarshiniPick() {
  const darshini = BANGALORE_DARSHINIS[getDayOfYear() % BANGALORE_DARSHINIS.length];

  return (
    <div
      className="rounded overflow-hidden shadow-lg"
      style={{ background: "#FFFFFF", border: "1px solid rgba(198,124,42,0.15)" }}
    >
      <div className="flex flex-col md:flex-row">
        {/* Decorative left panel — emoji + year */}
        <div
          className="relative md:w-52 h-48 md:h-auto flex-shrink-0 flex flex-col items-center justify-center gap-4 px-6 py-8"
          style={{ background: "rgba(198,124,42,0.07)" }}
        >
          <span style={{ fontSize: "4.5rem", lineHeight: 1 }}>{darshini.emoji}</span>
          <span
            className="font-lora font-bold text-5xl select-none"
            style={{ color: "rgba(198,124,42,0.25)" }}
          >
            {darshini.established}
          </span>
          {/* Est. label */}
          <div
            className="absolute top-3 left-3 px-2 py-1 rounded text-xs font-semibold"
            style={{ background: "rgba(45,80,22,0.85)", color: "#FBF5E6" }}
          >
            Est. {darshini.established}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col justify-between flex-1">
          <div>
            <div className="text-xs tracking-widest uppercase mb-2" style={{ color: "#C67C2A" }}>
              ☕ Darshini of the Day · {darshini.neighbourhood}
            </div>

            <h3 className="font-lora text-2xl font-bold leading-tight" style={{ color: "#2D5016" }}>
              {darshini.name}
            </h3>
            <p className="font-kannada text-base mt-0.5 mb-3" style={{ color: "#8B7355" }}>
              {darshini.kannada}
            </p>

            {/* What to order */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded mb-4"
              style={{ background: "rgba(198,124,42,0.1)", color: "#C67C2A" }}
            >
              <span className="text-xs font-semibold uppercase tracking-wide">Order this →</span>
              <span className="text-sm font-bold">{darshini.orderThis}</span>
            </div>

            <p className="text-sm italic leading-relaxed mb-3" style={{ color: "#8B7355" }}>
              &ldquo;{darshini.tagline}&rdquo;
            </p>

            <p className="text-sm leading-relaxed" style={{ color: "#5C3A1E" }}>
              {darshini.fact}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
