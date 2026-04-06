"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "11+", label: "Modules" },
  { value: "100%", label: "Web-based" },
  { value: "Free", label: "To start" }
];

export function Cta() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink px-8 py-14 text-white md:px-14">

        {/* ── Animated background orbs ──────────────────────── */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <motion.div
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -20, 15, 0],
              scale: [1, 1.1, 0.95, 1]
            }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brass/15 blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -25, 20, 0],
              y: [0, 25, -10, 0],
              scale: [1, 0.9, 1.1, 1]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-moss/20 blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, 20, -15, 0],
              y: [0, -15, 20, 0]
            }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            className="absolute top-1/2 left-1/3 h-48 w-48 -translate-y-1/2 rounded-full bg-clay/10 blur-2xl"
          />
          {/* Top accent line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brass/30 to-transparent" />
        </div>

        {/* ── Content ──────────────────────────────────────── */}
        <div className="relative">
          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold uppercase tracking-[0.25em] text-white/50"
          >
            Start Free
          </motion.p>

          {/* Headline — word by word reveal */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 max-w-xl font-display text-4xl leading-tight sm:text-5xl"
          >
            Move your real estate and construction operations{" "}
            <span className="text-gradient-gold">out of Excel.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="mt-4 max-w-xl text-sm leading-7 text-white/65"
          >
            CRM, projects, inventory, invoicing, reporting, and AI cost insights — all
            in one control panel built for your field reality.
          </motion.p>

          {/* Stat pills */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm backdrop-blur"
              >
                <span className="font-semibold text-brass">{s.value}</span>
                <span className="ml-1.5 text-white/55">{s.label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.42 }}
            className="mt-10"
          >
            <motion.a
              href="/auth"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-brass px-8 py-4 text-sm font-semibold text-ink shadow-xl shadow-brass/20 transition-shadow hover:shadow-2xl hover:shadow-brass/30"
            >
              <span className="relative z-10">Start With Free Account</span>
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="relative z-10 text-ink/70"
              >
                →
              </motion.span>
              {/* Shimmer on hover */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
