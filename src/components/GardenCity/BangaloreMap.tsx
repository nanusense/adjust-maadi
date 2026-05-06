"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BANGALORE_LAKES } from "@/lib/bangalore-lakes";
import { BANGALORE_PARKS } from "@/lib/bangalore-parks";

type FilterType = "all" | "lake" | "park";

interface MapPoint {
  name: string;
  kannada: string;
  lat: number;
  lng: number;
  type: "lake" | "park";
  fact: string;
  photo: string;
  area: string;
  restoration?: string;
  bestTime?: string;
}

const POINTS: MapPoint[] = [
  ...BANGALORE_LAKES.map((l) => ({ ...l, type: "lake" as const, bestTime: undefined })),
  ...BANGALORE_PARKS.map((p) => ({ ...p, type: "park" as const, restoration: undefined })),
];

const COLORS = {
  lake: { fill: "#2563EB", border: "#1D4ED8", active: "#1e3a8a" },
  park: { fill: "#16a34a", border: "#15803d", active: "#14532d" },
};

const totalLakeAcres = BANGALORE_LAKES.reduce((sum, l) => {
  const n = parseInt(l.area.replace(/[^0-9]/g, ""));
  return sum + (isNaN(n) ? 0 : n);
}, 0);
const totalParkAcres = BANGALORE_PARKS.reduce((sum, p) => {
  const n = parseInt(p.area.replace(/[^0-9]/g, ""));
  return sum + (isNaN(n) ? 0 : n);
}, 0);

export function BangaloreMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<MapPoint | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [mounted, setMounted] = useState(false);
  const leafletRef = useRef<{
    map: L.Map;
    markers: { point: MapPoint; marker: L.CircleMarker }[];
  } | null>(null);

  useEffect(() => { setMounted(true); }, []);

  // Build map once
  useEffect(() => {
    if (!mounted || !mapRef.current) return;
    if (leafletRef.current) return;

    let L: typeof import("leaflet");

    import("leaflet").then((mod) => {
      L = mod.default;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [12.97, 77.59],
        zoom: 11,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org">OSM</a>',
        subdomains: "abcd",
        maxZoom: 17,
      }).addTo(map);

      const markers: { point: MapPoint; marker: L.CircleMarker }[] = [];

      POINTS.forEach((point) => {
        const c = COLORS[point.type];
        const radius = point.type === "lake" ? 8 : 6;
        const marker = L.circleMarker([point.lat, point.lng], {
          radius,
          fillColor: c.fill,
          color: c.border,
          weight: 1.5,
          opacity: 1,
          fillOpacity: 0.8,
        }).addTo(map);

        marker.bindTooltip(point.name, {
          permanent: false,
          direction: "top",
          offset: [0, -10],
          className: "namma-tooltip",
        });

        marker.on("click", () => {
          setSelected(point);
          map.panTo([point.lat, point.lng], { animate: true, duration: 0.4 });
          // Pulse the clicked marker
          marker.setStyle({ weight: 3, fillOpacity: 1 });
          setTimeout(() => marker.setStyle({ weight: 1.5, fillOpacity: 0.8 }), 800);
        });

        markers.push({ point, marker });
      });

      leafletRef.current = { map, markers };
    });

    return () => {
      if (leafletRef.current) {
        leafletRef.current.map.remove();
        leafletRef.current = null;
      }
    };
  }, [mounted]);

  // Apply filter by hiding/showing markers
  useEffect(() => {
    if (!leafletRef.current) return;
    leafletRef.current.markers.forEach(({ point, marker }) => {
      if (filter === "all" || point.type === filter) {
        marker.setStyle({ opacity: 1, fillOpacity: 0.8 });
      } else {
        marker.setStyle({ opacity: 0, fillOpacity: 0 });
      }
    });
  }, [filter]);

  function panTo(point: MapPoint) {
    setSelected(point);
    if (leafletRef.current) {
      leafletRef.current.map.panTo([point.lat, point.lng], { animate: true, duration: 0.5 });
      leafletRef.current.map.setZoom(13, { animate: true });
    }
  }

  const visibleLakes = filter !== "park" ? BANGALORE_LAKES : [];
  const visibleParks = filter !== "lake" ? BANGALORE_PARKS : [];

  return (
    <div className="rounded-xl overflow-hidden shadow-xl" style={{ border: "1px solid rgba(45,80,22,0.12)" }}>

      {/* ── Header ── */}
      <div className="px-5 py-4" style={{ background: "#2D5016" }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs tracking-widest uppercase mb-0.5" style={{ color: "#D4A843" }}>
              Interactive
            </div>
            <h3 className="font-lora text-xl font-bold text-white">Bengaluru Green Map</h3>
          </div>

          {/* Filter chips */}
          <div className="flex items-center gap-2">
            {(["all", "lake", "park"] as FilterType[]).map((f) => {
              const label = f === "all"
                ? `All (${BANGALORE_LAKES.length + BANGALORE_PARKS.length})`
                : f === "lake"
                ? `💧 Lakes (${BANGALORE_LAKES.length})`
                : `🌳 Parks (${BANGALORE_PARKS.length})`;
              const active = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
                  style={{
                    background: active ? "#D4A843" : "rgba(255,255,255,0.12)",
                    color: active ? "#2D5016" : "rgba(255,255,255,0.85)",
                    border: active ? "none" : "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Map ── */}
      <div className="relative">
        {mounted && (
          <style>{`
            .leaflet-container { font-family: inherit; }
            .leaflet-control-attribution { font-size: 9px !important; }
            .leaflet-control-zoom a { border-radius: 6px !important; }
            .namma-tooltip {
              background: rgba(45,80,22,0.92);
              color: #FBF5E6;
              border: none;
              border-radius: 6px;
              padding: 3px 8px;
              font-size: 11px;
              font-weight: 500;
              box-shadow: 0 2px 8px rgba(0,0,0,0.25);
              white-space: nowrap;
            }
            .namma-tooltip::before { display: none; }
          `}</style>
        )}
        <div ref={mapRef} style={{ height: "480px", width: "100%", background: "#f5f0e8" }} />
        {!mounted && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "#f0ebe0" }}>
            <span className="text-sm" style={{ color: "#8B7355" }}>Loading map…</span>
          </div>
        )}
      </div>

      {/* ── Selected info card ── */}
      <div style={{ background: "#FFFFFF", borderTop: "1px solid rgba(45,80,22,0.08)" }}>
        {selected ? (
          <div className="flex flex-col sm:flex-row gap-0">
            {/* Photo */}
            <div className="relative sm:w-44 h-36 sm:h-auto flex-shrink-0 overflow-hidden">
              <Image
                src={selected.photo}
                alt={selected.name}
                fill
                className="object-cover"
                unoptimized
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop";
                }}
              />
              {/* Type badge */}
              <div
                className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: COLORS[selected.type].fill, color: "#fff" }}
              >
                {selected.type === "lake" ? "💧 Lake" : "🌳 Park"}
              </div>
            </div>

            {/* Text */}
            <div className="flex-1 p-4 flex flex-col justify-between gap-2">
              <div>
                <div className="flex items-baseline gap-2 mb-0.5 flex-wrap">
                  <span className="font-lora font-bold text-base leading-tight" style={{ color: "#2D5016" }}>
                    {selected.name}
                  </span>
                  <span className="font-kannada text-sm" style={{ color: "#8B7355" }}>
                    {selected.kannada}
                  </span>
                </div>
                <span className="text-xs font-medium" style={{ color: "#C67C2A" }}>
                  {selected.area}
                  {selected.type === "lake" && selected.restoration && ` · ${selected.restoration}`}
                  {selected.type === "park" && selected.bestTime && ` · ${selected.bestTime}`}
                </span>
                <p className="text-sm leading-relaxed mt-2" style={{ color: "#5C3A1E" }}>
                  {selected.fact}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 sm:relative sm:top-auto sm:right-auto flex-shrink-0 self-start mt-2 mr-2 text-sm w-6 h-6 flex items-center justify-center rounded-full"
              style={{ color: "#8B7355", background: "rgba(139,115,85,0.1)" }}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="px-5 py-4 text-center text-xs" style={{ color: "#8B7355" }}>
            Tap any dot on the map — or a name below — to explore
          </div>
        )}
      </div>

      {/* ── Scrollable name list ── */}
      <div style={{ background: "#FAFAF8", borderTop: "1px solid rgba(45,80,22,0.06)" }}>
        {/* Lakes */}
        {visibleLakes.length > 0 && (
          <div className="px-4 pt-4 pb-2">
            <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#2563EB" }}>
              💧 Lakes
            </div>
            <div className="flex flex-wrap gap-1.5">
              {BANGALORE_LAKES.map((l) => (
                <button
                  key={l.name}
                  onClick={() => panTo({ ...l, type: "lake", bestTime: undefined })}
                  className="text-xs px-2.5 py-1 rounded-full transition-all"
                  style={{
                    background: selected?.name === l.name
                      ? "rgba(37,99,235,0.15)"
                      : "rgba(37,99,235,0.07)",
                    color: selected?.name === l.name ? "#1e3a8a" : "#2563EB",
                    border: selected?.name === l.name
                      ? "1px solid rgba(37,99,235,0.4)"
                      : "1px solid rgba(37,99,235,0.15)",
                    fontWeight: selected?.name === l.name ? 600 : 400,
                  }}
                >
                  {l.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Parks */}
        {visibleParks.length > 0 && (
          <div className="px-4 pt-3 pb-4">
            <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#16a34a" }}>
              🌳 Parks & Forests
            </div>
            <div className="flex flex-wrap gap-1.5">
              {BANGALORE_PARKS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => panTo({ ...p, type: "park", restoration: undefined })}
                  className="text-xs px-2.5 py-1 rounded-full transition-all"
                  style={{
                    background: selected?.name === p.name
                      ? "rgba(22,163,74,0.15)"
                      : "rgba(22,163,74,0.07)",
                    color: selected?.name === p.name ? "#14532d" : "#16a34a",
                    border: selected?.name === p.name
                      ? "1px solid rgba(22,163,74,0.4)"
                      : "1px solid rgba(22,163,74,0.15)",
                    fontWeight: selected?.name === p.name ? 600 : 400,
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Stats bar ── */}
      <div
        className="px-5 py-3 flex flex-wrap gap-x-6 gap-y-1 text-xs"
        style={{ background: "#2D5016", color: "rgba(255,255,255,0.6)" }}
      >
        <span>
          <span className="font-semibold text-white">{BANGALORE_LAKES.length}</span> lakes mapped
          · <span className="font-semibold text-white">{totalLakeAcres.toLocaleString()}+</span> acres of water
        </span>
        <span>
          <span className="font-semibold text-white">{BANGALORE_PARKS.length}</span> parks &amp; forests
          · <span className="font-semibold text-white">{totalParkAcres.toLocaleString()}+</span> acres of green
        </span>
        <span style={{ color: "rgba(255,255,255,0.35)" }}>Bengaluru has 180+ lakes and 1,000+ parks</span>
      </div>
    </div>
  );
}
