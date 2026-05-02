"use client";

import { useEffect, useRef, useState } from "react";
import { BANGALORE_LAKES } from "@/lib/bangalore-lakes";
import { BANGALORE_PARKS } from "@/lib/bangalore-parks";

interface MapPoint {
  name: string;
  kannada: string;
  lat: number;
  lng: number;
  type: "lake" | "park";
  fact: string;
}

const POINTS: MapPoint[] = [
  ...BANGALORE_LAKES.map((l) => ({ ...l, type: "lake" as const })),
  ...BANGALORE_PARKS.map((p) => ({ ...p, type: "park" as const })),
];

// Lake blue, Park green
const COLORS = {
  lake: { fill: "#2563EB", border: "#1D4ED8", label: "#1e3a8a" },
  park: { fill: "#16a34a", border: "#15803d", label: "#14532d" },
};

export function BangaloreMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<MapPoint | null>(null);
  const [mounted, setMounted] = useState(false);
  const leafletRef = useRef<{ map: L.Map; markers: L.CircleMarker[] } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !mapRef.current) return;
    if (leafletRef.current) return; // already initialised

    let L: typeof import("leaflet");

    import("leaflet").then((mod) => {
      L = mod.default;

      // Fix default icon paths that break with bundlers
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [12.97, 77.59],
        zoom: 11,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
      });

      // Warm, muted tile layer
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org">OSM</a>',
        subdomains: "abcd",
        maxZoom: 16,
      }).addTo(map);

      const markers: L.CircleMarker[] = [];

      POINTS.forEach((point) => {
        const color = COLORS[point.type];
        const marker = L.circleMarker([point.lat, point.lng], {
          radius: 9,
          fillColor: color.fill,
          color: color.border,
          weight: 2,
          opacity: 1,
          fillOpacity: 0.85,
        }).addTo(map);

        marker.on("click", () => {
          setSelected(point);
          map.panTo([point.lat, point.lng], { animate: true, duration: 0.4 });
        });

        markers.push(marker);
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

  return (
    <div className="rounded overflow-hidden shadow-xl" style={{ border: "1px solid rgba(45,80,22,0.12)" }}>
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ background: "#2D5016" }}
      >
        <div>
          <div className="text-xs tracking-widest uppercase mb-0.5" style={{ color: "#D4A843" }}>
            Interactive
          </div>
          <h3 className="font-lora text-xl font-bold text-white">Bengaluru Green Map</h3>
        </div>
        <div className="flex items-center gap-4 text-xs" style={{ color: "rgba(255,255,255,0.8)" }}>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-500" />
            Lakes ({BANGALORE_LAKES.length})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-green-600" />
            Parks ({BANGALORE_PARKS.length})
          </span>
        </div>
      </div>

      {/* Map container */}
      <div className="relative">
        {/* Leaflet CSS */}
        {mounted && (
          <style>{`
            .leaflet-container { font-family: inherit; }
            .leaflet-control-attribution { font-size: 9px !important; }
            .leaflet-control-zoom a { border-radius: 6px !important; }
          `}</style>
        )}

        <div
          ref={mapRef}
          style={{ height: "380px", width: "100%", background: "#f5f0e8" }}
        />

        {/* Placeholder before mount */}
        {!mounted && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "#f0ebe0" }}
          >
            <span className="text-sm" style={{ color: "#8B7355" }}>Loading map...</span>
          </div>
        )}
      </div>

      {/* Selected point info */}
      <div
        style={{
          minHeight: "72px",
          background: "#FBF5E6",
          borderTop: "1px solid rgba(45,80,22,0.08)",
          padding: "1rem 1.25rem",
        }}
      >
        {selected ? (
          <div className="flex items-start gap-3">
            <span
              className="flex-shrink-0 w-2.5 h-2.5 rounded-full mt-1.5"
              style={{ background: COLORS[selected.type].fill }}
            />
            <div>
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="font-lora font-semibold text-sm" style={{ color: "#2D5016" }}>
                  {selected.name}
                </span>
                <span className="font-kannada text-xs" style={{ color: "#8B7355" }}>
                  {selected.kannada}
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#5C3A1E" }}>
                {selected.fact}
              </p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="flex-shrink-0 ml-auto text-xs"
              style={{ color: "#8B7355" }}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        ) : (
          <p className="text-xs text-center" style={{ color: "#8B7355" }}>
            Tap any dot to explore a lake or park
          </p>
        )}
      </div>
    </div>
  );
}
