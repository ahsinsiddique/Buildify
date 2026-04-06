import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Legacy dashboard tokens (kept for compatibility)
        ink: "#0f172a",
        sand: "#f4efe7",
        clay: "#bb6b3f",
        moss: "#365847",
        brass: "#c79b42",
        // MONOLITH dark theme (Stitch-generated)
        primary: "#f3ca50",
        "on-primary": "#3d2f00",
        "inverse-primary": "#745b00",
        "primary-fixed": "#ffe08b",
        surface: "#0a0a0a",
        "surface-container": "#111111",
        "surface-container-high": "#1a1a1a",
        "surface-container-highest": "#242423",
        "surface-variant": "#1f1f1e",
        "surface-bright": "#222222",
        "surface-container-lowest": "#050505",
        "on-surface": "#e5e2e1",
        "on-surface-variant": "#d0c5af",
        outline: "#99907c",
        "outline-variant": "#3d382b",
        // Marketing alias tokens
        gold: "#f3ca50",
        "gold-dark": "#d5af37",
        "gold-dim": "#eac249",
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        headline: ["Manrope", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        label: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "reveal": "reveal 1.2s cubic-bezier(0.77, 0, 0.175, 1) forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        reveal: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
