"use client";

import { getDayOfYear } from "@/lib/dates";
import { BANGALORE_FACTS } from "@/lib/bangalore-facts";

export function DidYouKnow() {
  const { fact, emoji } = BANGALORE_FACTS[getDayOfYear() % BANGALORE_FACTS.length];

  return (
    <div
      className="rounded p-8 relative overflow-hidden shadow-lg"
      style={{ background: "#FFFFFF", border: "1px solid rgba(198,124,42,0.15)" }}
    >
      {/* Large decorative emoji watermark */}
      <div
        className="absolute top-4 right-6 select-none pointer-events-none"
        style={{ fontSize: "6rem", opacity: 0.07, lineHeight: 1 }}
        aria-hidden
      >
        {emoji}
      </div>

      <div className="relative z-10 max-w-2xl">
        <div className="text-xs tracking-widest uppercase mb-5 flex items-center gap-2" style={{ color: "#C67C2A" }}>
          <span
            className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs font-bold flex-shrink-0"
            style={{ background: "#C67C2A" }}
          >
            ?
          </span>
          Did You Know · Bengaluru
        </div>

        <p
          className="font-lora leading-relaxed"
          style={{ color: "#2D5016", fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}
        >
          {fact}
        </p>
      </div>
    </div>
  );
}
