"use client";

import { useWordOfTheDay } from "@/hooks/useWordOfTheDay";

const categoryEmoji: Record<string, string> = {
  nature: "🌿",
  food: "🍽️",
  slang: "😄",
  culture: "🎭",
  everyday: "💬",
  proverb: "📜",
};

const categoryColor: Record<string, string> = {
  nature: "#2D5016",
  food: "#C67C2A",
  slang: "#7C3AED",
  culture: "#B45309",
  everyday: "#2D5016",
  proverb: "#5C3A1E",
};

export function WordOfTheDay() {
  const word = useWordOfTheDay();
  const category = word.category || "everyday";
  const emoji = categoryEmoji[category] || "💬";
  const color = categoryColor[category] || "#2D5016";

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12 relative">
          <div
            className="kannada-watermark absolute inset-x-0 -top-8 text-center pointer-events-none"
            style={{ fontSize: "clamp(3rem, 10vw, 9rem)", opacity: 0.05 }}
          >
            ಕನ್ನಡ
          </div>
          <div
            className="inline-block text-xs tracking-[0.3em] uppercase mb-3 px-4 py-1 rounded-full"
            style={{ background: "rgba(198, 124, 42, 0.1)", color: "#C67C2A" }}
          >
            Namma Kannada
          </div>
          <h2
            className="font-lora text-4xl md:text-5xl"
            style={{ color: "#2D5016" }}
          >
            Kannada Gottha?
          </h2>
          <p className="mt-2 text-sm" style={{ color: "#8B7355" }}>
            A new Kannada word every day. Learn, share, celebrate.
          </p>
        </div>

        {/* Main card */}
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${color} 0%, ${color}dd 40%, #1a2e0a 100%)`,
            minHeight: "420px",
          }}
        >
          {/* Decorative Kannada watermark inside card */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            aria-hidden
          >
            <span
              className="font-kannada font-bold text-white select-none"
              style={{
                fontSize: "clamp(6rem, 20vw, 18rem)",
                opacity: 0.04,
                lineHeight: 1,
              }}
            >
              {word.kannada.length > 4 ? word.kannada.slice(0, 4) : word.kannada}
            </span>
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 md:p-12 flex flex-col items-center text-center">
            {/* Category badge */}
            <div className="mb-6">
              <span
                className="inline-flex items-center gap-2 text-xs tracking-widest uppercase px-4 py-1.5 rounded-full"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  color: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                {emoji} {category}
              </span>
            </div>

            {/* Main Kannada word */}
            <div
              className="font-kannada font-bold leading-none mb-4"
              style={{
                fontSize: "clamp(3.5rem, 12vw, 8rem)",
                color: "white",
                textShadow: "0 4px 30px rgba(0,0,0,0.3)",
                lineHeight: 1.1,
              }}
            >
              {word.kannada}
            </div>

            {/* Transliteration */}
            <div
              className="font-lora italic text-2xl md:text-3xl mb-2"
              style={{ color: "#D4A843", fontWeight: 400 }}
            >
              {word.transliteration}
            </div>

            {/* Meaning */}
            <div
              className="text-lg md:text-xl font-medium mb-8"
              style={{ color: "rgba(255, 255, 255, 0.9)" }}
            >
              {word.meaning}
            </div>

            {/* Divider */}
            <div
              className="w-16 h-px mb-8"
              style={{ background: "rgba(212, 168, 67, 0.5)" }}
            />

            {/* Example sentence */}
            <div
              className="max-w-lg rounded-2xl p-5 mb-6"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
              }}
            >
              <p
                className="font-kannada text-lg md:text-xl mb-1 leading-relaxed"
                style={{ color: "rgba(255, 255, 255, 0.95)" }}
              >
                &ldquo;{word.example.kannada}&rdquo;
              </p>
              <p
                className="font-lora italic text-sm mb-2"
                style={{ color: "rgba(255, 255, 255, 0.78)" }}
              >
                {word.example.romanized}
              </p>
              <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", marginBottom: "0.5rem" }} />
              <p
                className="font-lora italic text-sm"
                style={{ color: "rgba(255, 255, 255, 0.65)" }}
              >
                {word.example.english}
              </p>
            </div>

            {/* Context note */}
            <div
              className="max-w-md text-sm leading-relaxed"
              style={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              <span style={{ color: "#D4A843" }}>✦ </span>
              {word.context}
            </div>
          </div>
        </div>

        {/* Bottom row: hint + share */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-2">
          <p className="text-sm" style={{ color: "#8B7355" }}>
            A new word every day. Come back tomorrow for more Kannada.
          </p>
          <button
            onClick={() => {
              const text = `Today's Kannada word: ${word.kannada} (${word.transliteration}): ${word.meaning}\n\n"${word.example.english}"\n\n${word.context}\n\nLearn more at Adjust Maadi 🌿`;
              if (navigator.share) {
                navigator.share({ title: "Kannada Word of the Day", text });
              } else {
                navigator.clipboard.writeText(text);
                alert("Copied to clipboard!");
              }
            }}
            className="self-start sm:self-auto flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-all hover:scale-105 active:scale-95 flex-shrink-0"
            style={{
              background: "rgba(198, 124, 42, 0.1)",
              color: "#C67C2A",
              border: "1px solid rgba(198, 124, 42, 0.3)",
            }}
          >
            <span>↗</span> Share this word
          </button>
        </div>
      </div>
    </section>
  );
}
