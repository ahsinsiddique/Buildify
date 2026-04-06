"use client";

import { useEffect } from "react";
import Link from "next/link";

export function Hero() {
  useEffect(() => {
    const onScroll = () => {
      document.querySelectorAll<HTMLElement>(".parallax-bg").forEach((el) => {
        el.style.setProperty("--scroll-y", `${window.pageYOffset * 0.5}px`);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="relative h-screen w-full overflow-hidden flex items-center">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80"
          alt="Construction site"
          className="w-full h-[120%] object-cover opacity-50 parallax-bg scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
      </div>

      <div className="relative z-10 px-8 md:px-16 lg:px-24 w-full max-w-7xl mx-auto">
        <div className="overflow-hidden mb-4">
          <span className="inline-block text-primary font-bold text-xs uppercase tracking-[0.5em] animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Construction ERP
          </span>
        </div>
        <h1
          className="font-headline text-6xl md:text-[9rem] font-extrabold letter-spacing-custom leading-[0.85] text-white mb-12 animate-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          Build Your<br />
          <span className="text-primary/90 italic font-light">Legacy.</span>
        </h1>
        <div className="flex flex-col md:flex-row items-end gap-12 animate-fade-up" style={{ animationDelay: "0.6s" }}>
          <p className="text-lg text-on-surface-variant max-w-xl font-light tracking-wide leading-relaxed">
            Construction, real estate, workforce, and finance — unified in one control panel. Built for builders who don't compromise.
          </p>
          <div className="flex gap-4">
            <Link
              href="/auth"
              className="bg-white text-black px-12 py-5 font-headline font-bold uppercase tracking-[0.2em] text-[11px] transition-all hover:bg-primary hover:text-on-primary"
            >
              Start Free
            </Link>
            <Link
              href="/#features"
              className="border border-white/20 text-white px-12 py-5 font-headline font-bold uppercase tracking-[0.2em] text-[11px] transition-all hover:border-primary hover:text-primary"
            >
              See Features
            </Link>
          </div>
        </div>
      </div>

      {/* Stat Strip */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/5 bg-black/40 backdrop-blur-sm">
        <div className="max-w-screen-2xl mx-auto px-8 md:px-16 py-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Active Projects", value: "200+" },
            { label: "Workers Tracked", value: "5,000+" },
            { label: "Invoices Issued", value: "PKR 2B+" },
            { label: "Cities", value: "12" },
          ].map((stat) => (
            <div key={stat.label} className="border-l-2 border-primary/30 pl-4">
              <p className="font-headline font-black text-2xl text-white">{stat.value}</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
        <span className="text-[9px] uppercase tracking-[0.4em] font-bold">Scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-primary to-transparent" />
      </div>
    </header>
  );
}
