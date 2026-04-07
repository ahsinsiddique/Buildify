import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Legacy dashboard tokens (kept for worker-management + compatibility)
        ink: "#0f172a",
        sand: "#f4efe7",
        clay: "#bb6b3f",
        moss: "#365847",
        brass: "#c79b42",

        // MONOLITH adaptive tokens — CSS variable driven, light/dark aware
        // Using rgb(var() / <alpha-value>) enables Tailwind opacity modifiers: text-primary/50
        primary:                    "rgb(var(--color-primary) / <alpha-value>)",
        "on-primary":               "rgb(var(--color-on-primary) / <alpha-value>)",
        "inverse-primary":          "rgb(var(--color-inverse-primary) / <alpha-value>)",
        "primary-fixed":            "rgb(var(--color-primary-fixed) / <alpha-value>)",
        surface:                    "rgb(var(--color-surface) / <alpha-value>)",
        "surface-container":        "rgb(var(--color-surface-container) / <alpha-value>)",
        "surface-container-high":   "rgb(var(--color-surface-container-high) / <alpha-value>)",
        "surface-container-highest":"rgb(var(--color-surface-container-highest) / <alpha-value>)",
        "surface-container-lowest": "rgb(var(--color-surface-container-lowest) / <alpha-value>)",
        "surface-variant":          "rgb(var(--color-surface-variant) / <alpha-value>)",
        "surface-bright":           "rgb(var(--color-surface-bright) / <alpha-value>)",
        "on-surface":               "rgb(var(--color-on-surface) / <alpha-value>)",
        "on-surface-variant":       "rgb(var(--color-on-surface-variant) / <alpha-value>)",
        outline:                    "rgb(var(--color-outline) / <alpha-value>)",
        "outline-variant":          "rgb(var(--color-outline-variant) / <alpha-value>)",

        // Marketing alias tokens — absolute brand gold, always bright
        gold:       "#f3ca50",
        "gold-dark": "#d5af37",
        "gold-dim":  "#eac249",
      },
      fontFamily: {
        display:  ["Georgia", "serif"],
        headline: ["Manrope", "sans-serif"],
        body:     ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        label:    ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "reveal":  "reveal 1.2s cubic-bezier(0.77, 0, 0.175, 1) forwards",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        reveal: {
          "0%":   { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
