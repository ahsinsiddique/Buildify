"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import appConfig from "@/lib/app-config";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Dashboard", href: "/dashboard" },
];

export function MarketingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-md border-b border-white/5">
      <div className="flex justify-between items-center px-8 md:px-12 py-5 max-w-7xl mx-auto">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={appConfig.logoUrl}
            alt={appConfig.logoAlt}
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="text-xl font-black tracking-tighter text-gold font-headline uppercase">
            {appConfig.appName}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[#e5e2e1] hover:text-gold transition-colors duration-300 font-headline tracking-tight text-sm uppercase"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth"
            className="text-[#e5e2e1] hover:text-gold transition-colors text-sm font-headline uppercase tracking-widest"
          >
            Log in
          </Link>
          <Link
            href="/auth"
            className="gold-gradient text-[#3d2f00] px-7 py-2.5 font-headline font-bold text-xs uppercase tracking-widest transition-transform active:scale-95 duration-200"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex md:hidden h-9 w-9 items-center justify-center border border-white/10"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className="block h-4 w-5 relative">
            <span className={`absolute left-0 h-0.5 w-full bg-gold transition-all ${menuOpen ? "top-[7px] rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 top-[7px] h-0.5 w-full bg-gold transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`absolute left-0 h-0.5 w-full bg-gold transition-all ${menuOpen ? "top-[7px] -rotate-45" : "top-[14px]"}`} />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#1c1b1b] border-t border-white/5 px-8 py-6">
          <nav className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-[#d0c5af] uppercase tracking-widest font-headline"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <hr className="border-white/10" />
            <Link href="/auth" className="text-sm text-[#e5e2e1] uppercase tracking-widest font-headline">Log in</Link>
            <Link
              href="/auth"
              className="gold-gradient text-[#3d2f00] px-6 py-3 text-center text-xs font-bold uppercase tracking-widest font-headline"
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </nav>
  );
}
