import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Dashboard / existing tokens
        ink: "#0f172a",
        sand: "#f4efe7",
        clay: "#bb6b3f",
        moss: "#365847",
        brass: "#c79b42",
        // Marketing dark theme tokens
        gold: "#f3ca50",
        "gold-dark": "#d5af37",
        "gold-dim": "#eac249",
        surface: "#131313",
        "surface-high": "#2a2a2a",
        "surface-low": "#1c1b1b",
        "surface-lowest": "#0e0e0e",
        "surface-bright": "#393939",
        "on-surface": "#e5e2e1",
        "on-surface-muted": "#d0c5af",
        "outline-gold": "#4d4635",
        "outline-muted": "#99907c",
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        headline: ["Manrope", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      }
    }
  },
  plugins: []
};

export default config;
