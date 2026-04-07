"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="border border-on-surface/10 bg-surface-container-high px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-on-surface hover:border-on-surface/20 transition-all"
      onClick={toggle}
      type="button"
    >
      {theme === "dark" ? "☀ Light" : "◐ Dark"}
    </button>
  );
}
