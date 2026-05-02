"use client";

import Image from "next/image";
import { NOSTALGIA_PHOTOS } from "@/lib/bangalore-nostalgia";
import { getDayOfYear } from "@/lib/dates";

export function NostalgiaSection() {
  const photo = NOSTALGIA_PHOTOS[getDayOfYear() % NOSTALGIA_PHOTOS.length];

  return (
    <section style={{ background: "#0f0a04" }}>
      {/* Section label */}
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-px" style={{ background: "#D4A843" }} />
          <span className="text-xs tracking-[0.25em] uppercase font-medium" style={{ color: "#D4A843" }}>
            Haḷe Bengaḷūru
          </span>
        </div>
        <h2 className="font-lora text-4xl md:text-5xl" style={{ color: "#F5EDD5" }}>
          Before It Became a Startup
        </h2>
        <p className="mt-2 text-sm" style={{ color: "rgba(212,168,67,0.55)" }}>
          Rare photographs from the 1790s to early 1900s. One image a day.
        </p>
      </div>

      {/* Full-width photograph */}
      <div className="max-w-6xl mx-auto px-4">
        <div
          className="relative w-full overflow-hidden rounded"
          style={{ height: "clamp(320px, 55vw, 580px)" }}
        >
          <Image
            src={photo.photo}
            alt={`${photo.thenName}, ${photo.era}`}
            fill
            className="object-cover"
            style={{ filter: "sepia(40%) contrast(1.08) brightness(0.88)" }}
            sizes="(max-width: 1280px) 100vw, 1152px"
            priority
            unoptimized
          />

          {/* Gradient — heavy bottom, light top */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,6,2,0.93) 0%, rgba(10,6,2,0.35) 48%, transparent 100%)",
            }}
          />

          {/* Ghost year watermark */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            aria-hidden
          >
            <span
              className="font-lora italic font-bold"
              style={{
                fontSize: "clamp(5rem, 18vw, 14rem)",
                color: "rgba(212,168,67,0.05)",
                lineHeight: 1,
              }}
            >
              {photo.era}
            </span>
          </div>

          {/* Era badge */}
          <div className="absolute top-6 left-6">
            <span
              className="text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide"
              style={{ background: "rgba(212,168,67,0.88)", color: "#140c02" }}
            >
              {photo.era}
            </span>
          </div>

          {/* Bottom text */}
          <div className="absolute bottom-0 left-0 right-0 px-7 md:px-12 pb-9 md:pb-12">
            <div className="flex flex-wrap items-baseline gap-x-8 gap-y-1 mb-3">
              <div>
                <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "#D4A843" }}>Then</p>
                <h3 className="font-lora text-2xl md:text-4xl font-bold leading-tight" style={{ color: "white" }}>
                  {photo.thenName}
                </h3>
              </div>
              <div className="hidden md:block w-px h-8 flex-shrink-0" style={{ background: "rgba(255,255,255,0.18)" }} />
              <div>
                <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "rgba(255,255,255,0.38)" }}>Now</p>
                <p className="font-lora text-base md:text-lg italic" style={{ color: "rgba(255,255,255,0.65)" }}>
                  {photo.nowName}
                </p>
              </div>
            </div>
            <p className="text-sm md:text-base leading-relaxed max-w-2xl" style={{ color: "rgba(255,255,255,0.75)" }}>
              {photo.description}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto px-4 pt-4 pb-16">
        <p className="text-xs" style={{ color: "rgba(212,168,67,0.28)" }}>
          {photo.credit} · A new photograph every day.
        </p>
      </div>
    </section>
  );
}
