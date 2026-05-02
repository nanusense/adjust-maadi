"use client";

import { BENGALURU_STATS } from "@/lib/city-stats";
import { LiveCounter } from "./LiveCounter";

export function CounterGrid() {
  return (
    <section
      className="py-20 px-4"
      style={{ background: "#2D5016" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12 relative">
          <div
            className="kannada-watermark absolute inset-x-0 -top-8 text-center pointer-events-none"
            style={{
              fontSize: "clamp(3rem, 10vw, 9rem)",
              opacity: 0.06,
              color: "white",
              WebkitTextStroke: "1px rgba(255,255,255,0.08)",
            }}
          >
            ಬೆಂಗಳೂರು
          </div>
          <div
            className="inline-block text-xs tracking-[0.3em] uppercase mb-3 px-4 py-1 rounded-full"
            style={{ background: "rgba(212, 168, 67, 0.15)", color: "#D4A843" }}
          >
            Live City Pulse
          </div>
          <h2
            className="font-lora text-4xl md:text-5xl"
            style={{ color: "white" }}
          >
            Bengaluru By the Numbers
          </h2>
          <p className="mt-2 text-sm" style={{ color: "rgba(251, 245, 230, 0.6)" }}>
            The city&apos;s heartbeat, counting in real time
          </p>
        </div>

        {/* Counter grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {BENGALURU_STATS.map((stat) => (
            <LiveCounter key={stat.label} stat={stat} />
          ))}
        </div>

        <div
          className="mt-8 text-center text-xs italic"
          style={{ color: "rgba(251, 245, 230, 0.4)" }}
        >
          Estimates based on city-wide averages. The real numbers are probably even bigger.
        </div>
      </div>
    </section>
  );
}
