export interface CityStat {
  label: string;
  emoji: string;
  perSecond?: number;
  static?: string;
  color: "amber" | "green" | "blue" | "orange" | "sky" | "purple" | "gold";
  description?: string;
}

export const BENGALURU_STATS: CityStat[] = [
  {
    label: "Cups of filter coffee consumed today",
    emoji: "☕",
    perSecond: 578,
    color: "amber",
    description: "~50M cups/day in Bengaluru — 10% of Karnataka's total",
  },
  {
    label: "Dosas served across the city today",
    emoji: "🫓",
    perSecond: 116,
    color: "orange",
    description: "~10M dosas a day. The city runs on masala dosa",
  },
  {
    label: "Songs played on Spotify in the city today",
    emoji: "🎵",
    perSecond: 243,
    color: "green",
    description: "~3M Spotify users, ~7 songs each per day",
  },
  {
    label: "Bengaluru's altitude above sea level",
    emoji: "🏔️",
    static: "920 m",
    color: "sky",
    description: "Higher than any other major Indian city — the reason the weather is legendary",
  },
  {
    label: "Trees in Cubbon Park",
    emoji: "🌳",
    static: "6,000+",
    color: "green",
    description: "Each one over a century old",
  },
  {
    label: "Flights landed at Kempegowda today",
    emoji: "✈️",
    perSecond: 0.006,
    color: "sky",
    description: "~500 landings/day — India's 3rd busiest airport",
  },
  {
    label: "Active startups calling Bengaluru home",
    emoji: "🚀",
    static: "25,000+",
    color: "gold",
    description: "More startups per sq km than almost anywhere on earth",
  },
  {
    label: "Namma Metro riders today",
    emoji: "🚇",
    perSecond: 4.75,
    color: "blue",
    description: "~4.1 lakh rides/day · 150M+ passengers in 2024",
  },
];
