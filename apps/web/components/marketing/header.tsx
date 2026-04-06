"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import appConfig from "@/lib/app-config";

export function MarketingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-[100] transition-all duration-500 border-b border-white/5 ${
        scrolled ? "glass-panel py-4" : "bg-transparent py-8"
      }`}
    >
      <div className="flex justify-between items-center px-8 md:px-16 max-w-screen-2xl mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <Image src={appConfig.logoUrl} alt={appConfig.logoAlt} width={32} height={32} className="object-contain" />
          <span className="text-xl font-black tracking-[-0.08em] text-white font-headline uppercase">
            {appConfig.appName}
          </span>
        </Link>

        <div className="hidden lg:flex gap-12">
          <Link href="/#features" className="text-primary font-bold text-[10px] uppercase tracking-[0.3em] hover:opacity-70 transition-all">Features</Link>
          <Link href="/#pricing" className="text-white/60 hover:text-white font-bold text-[10px] uppercase tracking-[0.3em] transition-all">Pricing</Link>
          <Link href="/dashboard" className="text-white/60 hover:text-white font-bold text-[10px] uppercase tracking-[0.3em] transition-all">Dashboard</Link>
          <Link href="/auth" className="text-white/60 hover:text-white font-bold text-[10px] uppercase tracking-[0.3em] transition-all">Sign In</Link>
        </div>

        <Link
          href="/auth"
          className="gold-gradient text-[#3d2f00] px-8 py-3 font-headline font-bold text-[10px] uppercase tracking-[0.2em] transition-transform hover:scale-105 active:scale-95"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
