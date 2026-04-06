"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import appConfig from "@/lib/app-config";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
];

export function MarketingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/8 bg-[rgba(246,240,232,0.85)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src={appConfig.logoUrl}
            alt={appConfig.logoAlt}
            width={32}
            height={32}
            className="rounded-lg object-contain"
          />
          <span className="text-base font-semibold tracking-tight text-[#0f172a]">
            {appConfig.appName}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-600 transition-colors hover:text-[#0f172a]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/auth"
            className="rounded-full border border-black/12 bg-white/60 px-5 py-2 text-sm font-medium backdrop-blur transition-colors hover:bg-white/80"
          >
            Log in
          </Link>
          <Link
            href="/auth"
            className="rounded-full bg-[#0f172a] px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-white/60 md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className="block h-4 w-5 relative">
            <span
              className={`absolute left-0 h-0.5 w-full bg-[#0f172a] transition-all ${menuOpen ? "top-[7px] rotate-45" : "top-0"}`}
            />
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-full bg-[#0f172a] transition-opacity ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`absolute left-0 h-0.5 w-full bg-[#0f172a] transition-all ${menuOpen ? "top-[7px] -rotate-45" : "top-[14px]"}`}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-black/8 bg-[rgba(246,240,232,0.95)] px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-slate-600"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <hr className="my-1 border-black/10" />
            <Link href="/auth" className="text-sm font-medium text-slate-700">
              Log in
            </Link>
            <Link
              href="/auth"
              className="rounded-full bg-[#0f172a] px-5 py-2 text-center text-sm font-semibold text-white"
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
