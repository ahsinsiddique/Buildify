"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const testimonials = [
  {
    quote: "Buildify didn't just streamline our workflow; it gave us complete financial visibility across 8 active sites simultaneously.",
    highlight: "complete financial visibility",
    author: "Tariq Mehmood",
    title: "CEO, TM Construction Group",
  },
  {
    quote: "The workforce portal and invoice automation are the gold standard for high-end construction transparency in Pakistan.",
    highlight: "gold standard",
    author: "Ayesha Farooq",
    title: "CFO, Skyline Developers",
  },
];

export function Cta() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("active"); }),
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );
    sectionRef.current?.querySelectorAll(".reveal-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      document.querySelectorAll<HTMLElement>(".parallax-bg").forEach((el) => {
        el.style.setProperty("--scroll-y", `${window.pageYOffset * 0.3}px`);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={sectionRef}>
      {/* Testimonials */}
      <div className="py-48 px-8 md:px-16 bg-surface">
        <div className="max-w-7xl mx-auto flex flex-col gap-32">
          {testimonials.map((t, i) => (
            <div
              key={t.author}
              className={`reveal-on-scroll max-w-5xl ${i % 2 !== 0 ? "self-end text-right" : ""}`}
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              <div className={`text-primary text-7xl mb-12 opacity-50 font-headline leading-none select-none ${i % 2 !== 0 ? "block ml-auto" : ""}`}>"</div>
              <blockquote className="text-4xl md:text-6xl font-extralight italic leading-tight text-white mb-16">
                {t.quote.split(new RegExp(`(${t.highlight})`, "i")).map((part, idx) =>
                  part.toLowerCase() === t.highlight.toLowerCase()
                    ? <span key={idx} className="font-bold text-primary not-italic">{part}</span>
                    : part
                )}
              </blockquote>
              <div className={`flex items-center gap-6 ${i % 2 !== 0 ? "justify-end" : ""}`}>
                {i % 2 !== 0 ? (
                  <>
                    <div>
                      <p className="font-bold text-lg uppercase tracking-widest text-on-surface">{t.author}</p>
                      <p className="text-xs text-outline tracking-[0.3em] uppercase">{t.title}</p>
                    </div>
                    <div className="w-16 h-px bg-primary flex-shrink-0" />
                  </>
                ) : (
                  <>
                    <div className="w-16 h-px bg-primary flex-shrink-0" />
                    <div>
                      <p className="font-bold text-lg uppercase tracking-widest text-on-surface">{t.author}</p>
                      <p className="text-xs text-outline tracking-[0.3em] uppercase">{t.title}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black py-40">
        <div className="absolute inset-0 z-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80"
            alt="Skyscraper"
            className="w-full h-full object-cover grayscale parallax-bg"
          />
        </div>
        <div className="relative z-10 max-w-screen-2xl mx-auto text-center px-8 reveal-on-scroll">
          <h2 className="font-headline text-7xl md:text-[10rem] font-black uppercase tracking-[-0.05em] leading-[0.8] mb-16 text-white">
            Your Projects.<br />Your Control.<br />
            <span className="text-primary italic font-light">Your Legacy.</span>
          </h2>
          <div className="flex flex-col items-center gap-12">
            <p className="text-white/60 text-xl max-w-2xl font-light tracking-wide">
              Join the builders using Buildify to run smarter, tighter, and more profitable operations.
            </p>
            <Link
              href="/auth"
              className="gold-gradient text-on-primary px-16 py-8 font-headline font-bold uppercase tracking-[0.3em] text-xs transition-all hover:scale-110 shadow-2xl shadow-primary/20 inline-block"
            >
              Start Building Today
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
