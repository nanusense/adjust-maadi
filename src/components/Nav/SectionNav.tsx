"use client";

import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "traffic",  label: "Namma Traffic" },
  { id: "news",     label: "City News" },
  { id: "events",   label: "What's On" },
  { id: "nature",   label: "Garden City" },
  { id: "kannada",  label: "ಕನ್ನಡ" },
  { id: "tech",     label: "Built Here" },
  { id: "history",  label: "Heritage" },
  { id: "numbers",  label: "City Facts" },
] as const;

export function SectionNav() {
  const [visible, setVisible] = useState(false);
  const [active, setActive]   = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Show nav after hero scrolls out of view
  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  // Scrollspy — highlight whichever section is nearest the top
  useEffect(() => {
    const els = SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        // Pick the entry that is intersecting and closest to top
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Scroll active pill into view inside the nav bar
  useEffect(() => {
    if (!active || !navRef.current) return;
    const pill = navRef.current.querySelector(`[data-section="${active}"]`) as HTMLElement | null;
    pill?.scrollIntoView({ inline: "nearest", behavior: "smooth", block: "nearest" });
  }, [active]);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 100; // height of top nav + this nav
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <div
      className="fixed left-0 right-0 z-40 transition-all duration-300 lg:hidden"
      style={{
        top: "60px", // sits flush under the main nav (py-4 + text-lg ≈ 60px)
        transform: visible ? "translateY(0)" : "translateY(-110%)",
        opacity: visible ? 1 : 0,
        background: "rgba(251,245,230,0.92)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(198,124,42,0.1)",
      }}
    >
      <div
        ref={navRef}
        className="flex items-center gap-1.5 px-4 py-2 overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {SECTIONS.map(({ id, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              data-section={id}
              onClick={() => scrollTo(id)}
              className="flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full transition-all"
              style={{
                background:   isActive ? "#2D5016"              : "rgba(45,80,22,0.06)",
                color:        isActive ? "#FBF5E6"              : "#5C3A1E",
                border:       isActive ? "1px solid #2D5016"    : "1px solid transparent",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
