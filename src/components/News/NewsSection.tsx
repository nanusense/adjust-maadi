"use client";

import { useNews } from "@/hooks/useNews";
import { ExternalLink } from "lucide-react";

const SOURCE_CONFIG = {
  "Deccan Herald":   { color: "#1a4a8a", bg: "rgba(26,74,138,0.08)"  },
  "Citizen Matters": { color: "#2D5016", bg: "rgba(45,80,22,0.08)"   },
} as const;

export function NewsSection() {
  const { news, loading } = useNews();

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-px flex-shrink-0" style={{ background: "#C67C2A" }} />
            <span className="text-xs tracking-[0.25em] uppercase font-medium" style={{ color: "#C67C2A" }}>
              Namma City
            </span>
          </div>
          <h2 className="font-lora text-4xl md:text-5xl" style={{ color: "#2D5016" }}>
            Bengaluru Today
          </h2>
          <p className="mt-2 text-sm" style={{ color: "#8B7355" }}>
            From Deccan Herald & Citizen Matters
          </p>
        </div>

        {/* News list */}
        {loading ? (
          <div className="space-y-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-4">
                <div className="w-16 h-3 rounded" style={{ background: "rgba(45,80,22,0.08)" }} />
                <div className="flex-1 h-3 rounded" style={{ background: "rgba(45,80,22,0.08)" }} />
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <p className="text-sm italic" style={{ color: "#8B7355" }}>
            No local news right now. Check back shortly.
          </p>
        ) : (
          <div className="divide-y" style={{ borderColor: "rgba(198,124,42,0.1)" }}>
            {news.map((item, i) => {
              const src = SOURCE_CONFIG[item.source];
              return (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 py-4 transition-opacity hover:opacity-80"
                >
                  {/* Index */}
                  <span
                    className="font-lora text-xs mt-1 w-5 flex-shrink-0 text-right tabular-nums"
                    style={{ color: "rgba(198,124,42,0.5)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium leading-snug mb-1.5 group-hover:underline underline-offset-2"
                      style={{ color: "#2D5016", textDecorationColor: "rgba(45,80,22,0.3)" }}
                    >
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: src.bg, color: src.color }}
                      >
                        {item.source}
                      </span>
                      {item.timeAgo && (
                        <span className="text-xs" style={{ color: "#9CA3AF" }}>
                          {item.timeAgo}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <ExternalLink
                    size={13}
                    className="flex-shrink-0 mt-1 opacity-0 group-hover:opacity-40 transition-opacity"
                    style={{ color: "#2D5016" }}
                  />
                </a>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex gap-4 text-xs" style={{ color: "#9CA3AF" }}>
          <a href="https://www.deccanherald.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
            deccanherald.com
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
