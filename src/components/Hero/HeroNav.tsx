"use client";

const NAV_ITEMS = [
  { kannada: "ಸಂಚಾರ",        label: "Namma Traffic", desc: "Corridor status & metro",          href: "#traffic"  },
  { kannada: "ಸುದ್ದಿ",         label: "City News",     desc: "Deccan Herald · The Hindu · Citizen Matters", href: "#news"     },
  { kannada: "ಕಾರ್ಯಕ್ರಮ",    label: "What's On",     desc: "Tech meetups & events today",     href: "#events"   },
  { kannada: "ಕನ್ನಡ ಗೊತ್ತಾ?",  label: "ಕನ್ನಡ",        desc: "Word of the day",                 href: "#kannada"  },
  { kannada: "ಪ್ರವಾಸ",         label: "Next Escape",   desc: "Your weekend day trip from the city", href: "#escape" },
];

function scrollTo(href: string) {
  const el = document.querySelector(href);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 100;
  window.scrollTo({ top: y, behavior: "smooth" });
}

export function HeroNav() {
  return (
    <div style={{ background: "#F5F3F0" }}>
      {/* Subtle label */}
      <div className="px-5 pt-3 pb-1 text-[10px] font-semibold tracking-widest uppercase" style={{ color: "#C4BAB0" }}>
        Quick shortcuts
      </div>

      {/* Container — gap-px trick for hairline dividers */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
        style={{
          gap: 1,
          background: "rgba(0,0,0,0.10)",
        }}
      >
        {NAV_ITEMS.map((item, i) => (
          <button
            key={item.href}
            onClick={() => scrollTo(item.href)}
            className="group flex flex-col gap-2 p-5 text-left transition-colors"
            style={{
              background: "#F5F3F0",
              /* last item spans 2 cols on 2-col grid to stay centred */
              ...(i === NAV_ITEMS.length - 1 ? { gridColumn: "span 1" } : {}),
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#EDEAE4")}
            onMouseLeave={e => (e.currentTarget.style.background = "#F5F3F0")}
          >
            {/* Kannada label */}
            <span
              className="text-[10px] font-semibold tracking-widest uppercase"
              style={{ color: "#9CA3AF" }}
            >
              {item.kannada}
            </span>

            {/* Section name */}
            <span
              className="font-bold text-base leading-tight"
              style={{ color: "#1a1a2e" }}
            >
              {item.label}
            </span>

            {/* Description */}
            <span
              className="text-xs leading-relaxed flex-1"
              style={{ color: "#6B7280" }}
            >
              {item.desc}
            </span>

            {/* Arrow */}
            <span
              className="text-base transition-opacity group-hover:opacity-80"
              style={{ color: "#1a1a2e", opacity: 0.25 }}
            >
              ↗
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
