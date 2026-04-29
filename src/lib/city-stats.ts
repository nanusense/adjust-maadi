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
    perSecond: 5787,
    color: "amber",
    description: "~500M cups/day in Karnataka, ~10% in Bengaluru",
  },
  {
    label: "Dosas served across the city today",
    emoji: "🫓",
    perSecond: 2315,
    color: "orange",
    description: "The city runs on masala dosa",
  },
  {
    label: "Songs played on Spotify in the city today",
    emoji: "🎵",
    perSecond: 12000,
    color: "green",
    description: "Bengaluru has music in its soul",
  },
  {
    label: "IT professionals working in the city",
    emoji: "💻",
    static: "2,000,000+",
    color: "blue",
    description: "The Silicon Valley of the East",
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
    perSecond: 0.012,
    color: "sky",
    description: "~500 flights/day, the world comes to Bengaluru",
  },
  {
    label: "Startups founded in Bengaluru this year",
    emoji: "🚀",
    perSecond: 0.003,
    color: "gold",
    description: "~100+ new startups launch every month",
  },
  {
    label: "GitHub repos created by Bengaluru devs this year",
    emoji: "👨‍💻",
    perSecond: 0.095,
    color: "purple",
    description: "Building the future, one commit at a time",
  },
];
