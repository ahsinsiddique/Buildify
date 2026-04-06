"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const services = [
  {
    num: "01",
    title: "Project Management Suite",
    desc: "Full project lifecycle — budgets, timelines, materials, and labour in one panel.",
  },
  {
    num: "02",
    title: "Financial Intelligence Hub",
    desc: "Real-time cash flow, P&L per project, and automated invoice reconciliation.",
  },
  {
    num: "03",
    title: "Workforce Operations Portal",
    desc: "Attendance tracking, daily wage computation, payment history, and worker analytics.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "Free",
    per: "forever",
    features: ["Up to 3 projects", "5 workers", "Basic invoicing", "Expense tracking"],
    cta: "Get Started",
    href: "/auth",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "PKR 4,999",
    per: "/ month",
    features: [
      "Unlimited projects",
      "Unlimited workers",
      "AI Intelligence Hub",
      "Financial dashboard",
      "Priority support",
    ],
    cta: "Start Free Trial",
    href: "/auth",
    highlighted: true,
  },
];

export function Pricing() {
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
    <section ref={sectionRef} id="pricing">
      {/* Services section */}
      <div className="py-40 bg-[#050505]">
        <div className="max-w-screen-2xl mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-start">
            <div className="sticky top-40 reveal-on-scroll">
              <h2 className="font-headline text-5xl md:text-8xl font-black letter-spacing-custom uppercase leading-none mb-12 text-on-surface">
                Engineering<br />
                <span className="text-primary italic font-extralight">Efficiency.</span>
              </h2>
              <div className="relative w-full aspect-[4/5] overflow-hidden grayscale brightness-75">
                <img
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80"
                  alt="Blueprint"
                  className="w-full h-full object-cover transition-transform duration-[3s] hover:scale-110"
                />
              </div>
            </div>
            <div className="space-y-32 pt-24 lg:pt-0">
              {services.map((s, i) => (
                <div
                  key={s.title}
                  className="reveal-on-scroll group"
                  style={{ transitionDelay: `${(i + 1) * 0.1}s` }}
                >
                  <div className="text-primary font-bold text-4xl mb-6 font-headline">{s.num}</div>
                  <h4 className="font-headline font-bold text-3xl mb-6 uppercase tracking-tight text-on-surface">
                    {s.title}
                  </h4>
                  <p className="text-on-surface-variant font-light text-xl leading-relaxed mb-8">{s.desc}</p>
                  <div className="w-16 h-px bg-primary transition-all duration-500 group-hover:w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="py-40 bg-surface px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto">
          <div className="text-center mb-24 reveal-on-scroll">
            <p className="text-primary font-bold text-[10px] uppercase tracking-[0.5em] mb-6">Pricing</p>
            <h2 className="font-headline text-5xl md:text-7xl font-black letter-spacing-custom uppercase text-on-surface">
              Simple.<br />
              <span className="text-primary italic font-extralight">Transparent.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, i) => (
              <div
                key={plan.name}
                className={`reveal-on-scroll border p-10 relative ${
                  plan.highlighted
                    ? "border-primary/40 bg-surface-container-high"
                    : "border-white/5 bg-surface-container"
                }`}
                style={{ transitionDelay: `${i * 0.15}s` }}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-8 gold-gradient text-on-primary px-5 py-1.5 text-[9px] font-bold uppercase tracking-[0.3em]">
                    Most Popular
                  </div>
                )}
                <p className="text-on-surface-variant text-[10px] uppercase tracking-[0.4em] mb-4">{plan.name}</p>
                <div className="mb-8">
                  <span className="font-headline font-black text-5xl text-white">{plan.price}</span>
                  <span className="text-on-surface-variant text-sm ml-2">{plan.per}</span>
                </div>
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-sm text-on-surface-variant">
                      <div className="w-1 h-1 bg-primary flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block text-center py-4 font-headline font-bold text-[10px] uppercase tracking-[0.3em] transition-all ${
                    plan.highlighted
                      ? "gold-gradient text-on-primary hover:scale-105"
                      : "border border-white/20 text-white hover:border-primary hover:text-primary"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
