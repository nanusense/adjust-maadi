"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getDayOfYear } from "@/lib/dates";
import { WIKIPEDIA_ARTICLES } from "@/lib/neighbourhood-days";

interface WikiData {
  title: string;
  extract: string;
  thumbnail?: string;
  content_urls?: { desktop?: { page?: string } };
  description?: string;
}

export function WikiDeepDive() {
  const [wiki, setWiki] = useState<WikiData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dayOfYear = getDayOfYear();
    const title = WIKIPEDIA_ARTICLES[dayOfYear % WIKIPEDIA_ARTICLES.length];

    fetch(`/api/wikipedia?title=${title}`)
      .then((r) => r.json())
      .then(setWiki)
      .catch(() => setWiki(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        className="rounded p-6 animate-pulse shadow-lg"
        style={{ background: "#F0E6C8", minHeight: "250px" }}
      />
    );
  }

  if (!wiki) return null;

  const extract = wiki.extract?.slice(0, 500) + (wiki.extract?.length > 500 ? "..." : "");

  return (
    <div
      className="rounded overflow-hidden shadow-xl"
      style={{
        background: "#F0E6C8",
        border: "1px solid rgba(198, 124, 42, 0.15)",
      }}
    >
      <div className="flex flex-col md:flex-row">
        {/* Thumbnail */}
        {wiki.thumbnail && (
          <div className="relative md:w-56 h-44 md:h-auto flex-shrink-0">
            <Image
              src={wiki.thumbnail}
              alt={wiki.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex flex-col justify-between flex-1">
          <div>
            <div
              className="text-xs tracking-widest uppercase mb-2"
              style={{ color: "#C67C2A" }}
            >
              📖 Bengaluru Deep Dive · Wikipedia
            </div>
            {wiki.description && (
              <div className="text-xs mb-1" style={{ color: "#8B7355" }}>
                {wiki.description}
              </div>
            )}
            <h3
              className="font-lora text-xl md:text-2xl font-bold mb-3"
              style={{ color: "#2D5016" }}
            >
              {wiki.title.replace(/_/g, " ")}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#5C3A1E" }}>
              {extract}
            </p>
          </div>

          {wiki.content_urls?.desktop?.page && (
            <a
              href={wiki.content_urls.desktop.page}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm font-medium transition-all hover:gap-3"
              style={{ color: "#C67C2A", textDecoration: "none" }}
            >
              Read the full story on Wikipedia →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
