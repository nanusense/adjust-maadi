"use client";

import { useDailyRotation } from "@/hooks/useDailyRotation";
import { FAMOUS_BANGALOREANS } from "@/lib/famous-bangaloreans";

export function PersonOfTheDay() {
  const person = useDailyRotation(FAMOUS_BANGALOREANS);

  return (
    <div
      className="rounded overflow-hidden shadow-xl"
      style={{
        background: "#F5EDD5",
        border: "1px solid rgba(198, 124, 42, 0.15)",
      }}
    >
      {/* Photo + basic info */}
      <div className="flex gap-5 p-6 pb-4">
        {/* Initials avatar */}
        <div
          className="flex-shrink-0 w-24 h-24 rounded flex items-center justify-center shadow-md"
          style={{
            background: person.color,
            border: "3px solid rgba(212, 168, 67, 0.3)",
          }}
        >
          <span
            className="font-lora font-bold text-white"
            style={{ fontSize: "2rem", lineHeight: 1 }}
          >
            {person.initials}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div
            className="text-xs tracking-widest uppercase mb-1"
            style={{ color: "#C67C2A" }}
          >
            {person.era && `${person.era} · `}{person.field}
          </div>
          <h3
            className="font-lora text-xl md:text-2xl font-bold leading-tight"
            style={{ color: "#2D5016" }}
          >
            {person.name}
          </h3>
        </div>
      </div>

      {/* Known for */}
      <div
        className="mx-6 mb-4 p-4 rounded"
        style={{ background: "rgba(45, 80, 22, 0.05)" }}
      >
        <p className="text-sm leading-relaxed" style={{ color: "#5C3A1E" }}>
          {person.knownFor}
        </p>
      </div>

      {/* Quote */}
      <div className="px-6 pb-6">
        <blockquote
          className="font-lora italic text-sm md:text-base leading-relaxed"
          style={{
            color: "#2D5016",
            borderLeft: "3px solid #D4A843",
            paddingLeft: "1rem",
          }}
        >
          &ldquo;{person.quote}&rdquo;
        </blockquote>
        <cite className="text-xs mt-2 block" style={{ color: "#8B7355" }}>
          {person.name}
        </cite>
      </div>
    </div>
  );
}
