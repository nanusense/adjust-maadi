import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-warm": "#FBF5E6",
        "bg-warm-dark": "#F5EDD5",
        forest: "#2D5016",
        "forest-light": "#4A7A28",
        "forest-muted": "#6B9E3A",
        amber: "#C67C2A",
        "amber-light": "#E09040",
        gold: "#D4A843",
        "gold-light": "#ECC060",
        bark: "#5C3A1E",
        "bark-light": "#8B5E3C",
        stone: "#8B7355",
        "sky-warm": "#87CEEB",
        cream: "#FBF5E6",
        parchment: "#F0E6C8",
      },
      fontFamily: {
        lora: ["Lora", "Georgia", "serif"],
        kannada: ['"Noto Sans Kannada"', "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.8s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
        float: "float 6s ease-in-out infinite",
        "rain-fall": "rainFall 1s linear infinite",
        "counter-tick": "counterTick 0.3s ease-out",
        "pulse-slow": "pulse 4s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        rainFall: {
          "0%": { transform: "translateY(-100%)", opacity: "0.7" },
          "100%": { transform: "translateY(100vh)", opacity: "0" },
        },
        counterTick: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      backgroundImage: {
        "warm-gradient": "linear-gradient(135deg, #FBF5E6 0%, #F0E6C8 100%)",
        "forest-gradient":
          "linear-gradient(135deg, #2D5016 0%, #4A7A28 100%)",
        "amber-gradient":
          "linear-gradient(135deg, #C67C2A 0%, #E09040 100%)",
        "gold-shimmer":
          "linear-gradient(90deg, transparent 0%, #D4A843 50%, transparent 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
