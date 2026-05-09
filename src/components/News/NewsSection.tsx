"use client";

import { useNews } from "@/hooks/useNews";

const SOURCE_CONFIG = {
  "Deccan Herald":   { color: "#1a4a8a", bg: "#F7F9FC" },
  "The Hindu":       { color: "#8B1A1A", bg: "#FBF7F7" },
  "Citizen Matters": { color: "#2D6A1A", bg: "#F7FBF7" },
} as const;

export function NewsSection() {
  const { news, loading } = useNews();

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: "#C67C2A" }}>
              ಸುದ್ದಿ
            </div>
            <h2 className="font-lora text-4xl md:text-5xl font-bold leading-tight" style={{ color: "#1a1a2e" }}>
              Bengaluru <em>Today</em>
            </h2>
          </div>
        </div>

        {/* ── Card grid ── */}
        {loading ? (
          /* Skeleton */
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8, overflow: "hidden", gap: 1, background: "rgba(0,0,0,0.14)" }}
          >
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse p-5" style={{ background: "#FAFAF7", minHeight: 160 }}>
                <div className="w-24 h-2 rounded mb-4" style={{ background: "rgba(0,0,0,0.06)" }} />
                <div className="space-y-2">
                  <div className="h-3 rounded" style={{ background: "rgba(0,0,0,0.06)" }} />
                  <div className="h-3 rounded w-4/5" style={{ background: "rgba(0,0,0,0.06)" }} />
                  <div className="h-3 rounded w-3/5" style={{ background: "rgba(0,0,0,0.06)" }} />
                </div>
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <p className="text-sm italic" style={{ color: "#8B7355" }}>
            No local news right now. Check back shortly.
          </p>
        ) : (
          /* Card grid — gap-px trick for hairline dividers */
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 8,
              overflow: "hidden",
              columnGap: 1,
              rowGap: 1,
              background: "rgba(0,0,0,0.22)",
            }}
          >
            {news.map((item, i) => {
              const src = SOURCE_CONFIG[item.source] ?? SOURCE_CONFIG["Deccan Herald"];
              return (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col p-5 transition-colors hover:brightness-[0.97]"
                  style={{ background: src.bg, minHeight: 160, position: "relative" }}
                >
                  {/* Coloured top stripe */}
                  <div
                    className="absolute top-0 left-0 right-0"
                    style={{ height: 3, background: src.color }}
                  />

                  {/* Source label */}
                  <div
                    className="text-[10px] font-semibold tracking-widest uppercase mt-1 mb-3"
                    style={{ color: src.color }}
                  >
                    {item.source}
                  </div>

                  {/* Headline */}
                  <p
                    className="font-lora text-base leading-snug flex-1 group-hover:underline underline-offset-2"
                    style={{ color: "#1a1a2e", textDecorationColor: "rgba(26,26,46,0.2)" }}
                  >
                    {item.title}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs" style={{ color: "#9CA3AF" }}>
                      {item.timeAgo || ""}
                    </span>
                    <span
                      className="text-base opacity-0 group-hover:opacity-40 transition-opacity"
                      style={{ color: "#1a1a2e" }}
                    >
                      ↗
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* ── Footer links ── */}
        <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-xs" style={{ color: "#9CA3AF" }}>
          <a href="https://www.deccanherald.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
            deccanherald.com
          </a>
          <span>·</span>
          <a href="https://www.thehindu.com/news/cities/bangalore/" target="_blank" rel="noopener noreferrer" className="hover:underline">
            thehindu.com
          </a>
          <span>·</span>
          <a href="https://citizenmatters.in" target="_blank" rel="noopener noreferrer" className="hover:underline">
            citizenmatters.in
          </a>
          <span>·</span>
          <span>Refreshed every 30 min</span>
        </div>
      </div>
    </section>
  );
}
