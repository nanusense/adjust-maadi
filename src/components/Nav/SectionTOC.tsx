"use client";

import { useEffect, useRef, useState, useCallback } from "react";

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

type SectionId = (typeof SECTIONS)[number]["id"];

// ─── shared scroll utility ────────────────────────────────────────────────────
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = 100;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}

// ─── shared scrollspy hook ────────────────────────────────────────────────────
function useScrollspy() {
  const [active, setActive] = useState<SectionId | null>(null);
  const [pastHero, setPastHero] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Hero visibility
  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const obs = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  // Active section
  useEffect(() => {
    const els = SECTIONS.map((s) =>
      document.getElementById(s.id)
    ).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActive(visible[0].target.id as SectionId);
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Scroll progress (0 → 1) for the vertical line fill
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      setScrollProgress(scrollHeight > 0 ? window.scrollY / scrollHeight : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { active, pastHero, scrollProgress };
}

// ─── Desktop TOC ──────────────────────────────────────────────────────────────
function DesktopTOC({
  active,
  pastHero,
  scrollProgress,
}: {
  active: SectionId | null;
  pastHero: boolean;
  scrollProgress: number;
}) {
  return (
    <div
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden lg:flex items-center pr-5 transition-all duration-500"
      style={{ opacity: pastHero ? 1 : 0, pointerEvents: pastHero ? "auto" : "none" }}
      aria-label="Page sections"
    >
      <div className="flex items-center gap-3">
        {/* Progress rail */}
        <div className="relative" style={{ width: "1px", height: `${SECTIONS.length * 28}px` }}>
          {/* Track */}
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: "rgba(198,124,42,0.15)" }}
          />
          {/* Fill */}
          <div
            className="absolute top-0 left-0 right-0 rounded-full"
            style={{
              height: `${scrollProgress * 100}%`,
              background: "linear-gradient(to bottom, #C67C2A, #2D5016)",
              transition: "height 0.15s ease-out",
            }}
          />
        </div>

        {/* Section markers */}
        <div className="flex flex-col" style={{ gap: "12px" }}>
          {SECTIONS.map(({ id, label }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="group flex items-center gap-2"
                title={label}
              >
                {/* Label */}
                <span
                  className="text-[10px] tracking-[0.18em] uppercase font-medium transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                  style={{
                    color: isActive ? "#C67C2A" : "#8B7355",
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateX(0)" : "translateX(6px)",
                  }}
                >
                  {label}
                </span>

                {/* Dot */}
                <div
                  className="rounded-full flex-shrink-0 transition-all duration-200"
                  style={{
                    width: isActive ? "8px" : "5px",
                    height: isActive ? "8px" : "5px",
                    background: isActive ? "#C67C2A" : "rgba(198,124,42,0.35)",
                    boxShadow: isActive ? "0 0 0 2px rgba(198,124,42,0.2)" : "none",
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Mobile FAB + slide-up sheet ─────────────────────────────────────────────
function MobileTOC({
  active,
  pastHero,
}: {
  active: SectionId | null;
  pastHero: boolean;
}) {
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close on outside tap
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on scroll
  useEffect(() => {
    if (!open) return;
    const handler = () => setOpen(false);
    window.addEventListener("scroll", handler, { passive: true, once: true });
    return () => window.removeEventListener("scroll", handler);
  }, [open]);

  const handleSelect = useCallback((id: string) => {
    setOpen(false);
    setTimeout(() => scrollToSection(id), 120);
  }, []);

  return (
    <>
      {/* FAB trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-5 z-50 lg:hidden w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          background: open ? "#2D5016" : "rgba(251,245,230,0.95)",
          border: "1px solid rgba(198,124,42,0.3)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          opacity: pastHero ? 1 : 0,
          pointerEvents: pastHero ? "auto" : "none",
          transform: pastHero ? "scale(1)" : "scale(0.8)",
          boxShadow: "0 4px 20px rgba(45,80,22,0.18), 0 1px 4px rgba(0,0,0,0.08)",
        }}
        aria-label={open ? "Close sections menu" : "Jump to section"}
        aria-expanded={open}
      >
        {open ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="#FBF5E6" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <rect y="0"  width="16" height="1.5" rx="0.75" fill="#5C3A1E" />
            <rect y="5"  width="11" height="1.5" rx="0.75" fill="#5C3A1E" />
            <rect y="10" width="7"  height="1.5" rx="0.75" fill="#5C3A1E" />
          </svg>
        )}
      </button>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 lg:hidden transition-opacity duration-300"
        style={{
          background: "rgba(45,80,22,0.25)",
          backdropFilter: "blur(2px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />

      {/* Slide-up sheet */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden rounded-t-2xl px-6 pt-5 pb-8 transition-transform duration-300 ease-out"
        style={{
          background: "rgba(251,245,230,0.97)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(198,124,42,0.2)",
          boxShadow: "0 -8px 40px rgba(45,80,22,0.15)",
          transform: open ? "translateY(0)" : "translateY(110%)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Page sections"
      >
        {/* Drag handle */}
        <div className="flex justify-center mb-5">
          <div
            className="rounded-full"
            style={{ width: "36px", height: "3px", background: "rgba(198,124,42,0.3)" }}
          />
        </div>

        {/* Sheet header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-px" style={{ background: "#C67C2A" }} />
          <span
            className="text-[10px] tracking-[0.25em] uppercase font-medium"
            style={{ color: "#C67C2A" }}
          >
            Sections
          </span>
        </div>

        {/* Section list */}
        <ul className="space-y-1" role="list">
          {SECTIONS.map(({ id, label }) => {
            const isActive = active === id;
            return (
              <li key={id}>
                <button
                  onClick={() => handleSelect(id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150"
                  style={{
                    background: isActive ? "rgba(45,80,22,0.08)" : "transparent",
                  }}
                >
                  <div
                    className="flex-shrink-0 rounded-full transition-all duration-200"
                    style={{
                      width: "6px",
                      height: "6px",
                      background: isActive ? "#C67C2A" : "rgba(198,124,42,0.3)",
                    }}
                  />
                  <span
                    className="text-sm transition-colors duration-150"
                    style={{
                      color: isActive ? "#2D5016" : "#5C3A1E",
                      fontFamily: id === "kannada" ? '"Noto Sans Kannada", sans-serif' : "inherit",
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {label}
                  </span>
                  {isActive && (
                    <span
                      className="ml-auto text-[9px] tracking-wider uppercase"
                      style={{ color: "#C67C2A" }}
                    >
                      Here
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
export function SectionTOC() {
  const { active, pastHero, scrollProgress } = useScrollspy();

  return (
    <>
      <DesktopTOC active={active} pastHero={pastHero} scrollProgress={scrollProgress} />
      <MobileTOC active={active} pastHero={pastHero} />
    </>
  );
}
