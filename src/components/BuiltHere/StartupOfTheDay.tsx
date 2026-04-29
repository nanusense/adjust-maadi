"use client";

import { useDailyRotation } from "@/hooks/useDailyRotation";
import { BANGALORE_STARTUPS } from "@/lib/bangalore-startups";

const categoryEmoji: Record<string, string> = {
  "IT Services": "💻",
  "E-commerce": "🛍️",
  "Food Tech": "🍔",
  "Mobility": "🚗",
  "Fintech": "💳",
  "Social Commerce": "📱",
  "EdTech": "📚",
  "Quick Commerce": "⚡",
  "Health & Fitness": "💪",
  "Logistics": "📦",
  "Developer Tools": "🔧",
  "Fintech/SaaS": "⚙️",
  "Consumer": "🌿",
  "AdTech": "📺",
};

export function StartupOfTheDay() {
  const startup = useDailyRotation(BANGALORE_STARTUPS);
  const emoji = categoryEmoji[startup.category] || "🚀";

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-xl"
      style={{
        background: `linear-gradient(135deg, ${startup.color}20 0%, ${startup.color}10 100%)`,
        border: `1px solid ${startup.color}30`,
      }}
    >
      {/* Header */}
      <div
        className="p-6 pb-4"
        style={{ borderBottom: `1px solid ${startup.color}20` }}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <div
              className="text-xs tracking-widest uppercase mb-2 flex items-center gap-2"
              style={{ color: startup.color, opacity: 0.8 }}
            >
              {emoji} {startup.category}
            </div>
            <h3
              className="font-lora text-3xl md:text-4xl font-bold leading-tight"
              style={{ color: "#2D2D2D" }}
            >
              {startup.name}
            </h3>
          </div>
          <div
            className="text-right text-xs"
            style={{ color: "#8B7355" }}
          >
            <div>Founded</div>
            <div className="font-lora text-2xl font-bold" style={{ color: startup.color }}>
              {startup.founded}
            </div>
          </div>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: "#5C3A1E" }}>
          {startup.description}
        </p>
      </div>

      {/* Fun fact */}
      <div className="p-6 pt-4">
        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm"
            style={{ background: `${startup.color}20` }}
          >
            💡
          </div>
          <div>
            <div className="text-xs font-medium mb-1" style={{ color: startup.color }}>
              Did you know?
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#5C3A1E" }}>
              {startup.funFact}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-6 pb-5"
      >
        <div className="text-xs" style={{ color: "#8B7355" }}>
          Founded by {startup.founder}
        </div>
        <div
          className="text-xs mt-1 font-medium italic"
          style={{ color: startup.color }}
        >
          &ldquo;This global company started right here in Bengaluru&rdquo;
        </div>
      </div>
    </div>
  );
}
