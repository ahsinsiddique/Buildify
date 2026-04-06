"use client";

import { useEffect, useRef } from "react";

const features = [
  {
    num: "01",
    title: "Project Command Centre",
    desc: "Full lifecycle project management — budgets, timelines, workforce, and materials unified.",
    img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
    tag: "Projects",
  },
  {
    num: "02",
    title: "Financial Intelligence",
    desc: "Real-time P&L, cash flow, expense breakdown, and invoice tracking in one financial hub.",
    img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
    tag: "Finance",
    offset: true,
  },
  {
    num: "03",
    title: "Workforce Portal",
    desc: "Track attendance, compute wages, process payments, and manage your entire site crew.",
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    tag: "Workers",
  },
];

export function Features() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("active"); }),
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );
    sectionRef.current?.querySelectorAll(".reveal-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-40 px-8 md:px-16 bg-surface overflow-hidden">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-32 gap-8 reveal-on-scroll">
          <h2 className="font-headline text-5xl md:text-7xl font-light tracking-tighter uppercase">
            Platform<br /><span className="font-bold">Capabilities.</span>
          </h2>
          <div className="max-w-xs">
            <p className="text-on-surface-variant text-sm font-light leading-relaxed mb-6">
              Purpose-built modules for every layer of construction and property management.
            </p>
            <a href="/auth" className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] border-b-2 border-primary/20 pb-2 hover:border-primary transition-all inline-block">
              Explore All Features
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 items-start">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`reveal-on-scroll ${
                i === 0 ? "md:col-span-7" :
                i === 1 ? "md:col-span-5 md:mt-48" :
                "md:col-span-6 md:col-start-4 mt-16"
              }`}
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              <div className="group relative overflow-hidden bg-surface-container mb-8">
                <img
                  src={f.img}
                  alt={f.title}
                  className={`w-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105 ${
                    i === 0 ? "aspect-[4/3]" : i === 1 ? "aspect-square" : "aspect-[16/9]"
                  }`}
                />
                <div className="absolute top-6 left-6 glass-panel px-4 py-1.5 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
                  {f.tag}
                </div>
              </div>
              <div className="border-l-2 border-primary/30 pl-8">
                <div className="text-primary font-bold text-2xl mb-3 font-headline">{f.num}</div>
                <h3 className="font-headline text-2xl md:text-3xl font-bold uppercase tracking-tight mb-3">{f.title}</h3>
                <p className="text-on-surface-variant text-sm font-light leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
