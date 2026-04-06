import Link from "next/link";

const services = [
  {
    icon: "🏗️",
    title: "Project Management",
    description:
      "Seamless execution from budgeting to site-level reporting. Timelines, work logs, and progress tracked in real-time.",
  },
  {
    icon: "💰",
    title: "Financial Intelligence",
    description:
      "Auto-invoicing, expense tracking, profitability analytics, and payment records — all linked to clients and projects.",
  },
  {
    icon: "👷",
    title: "Workforce Coordination",
    description:
      "Attendance, salary computation, worker payments, vendor management — the full field operations layer in one place.",
  },
];

const tiers = [
  {
    name: "Starter",
    price: "Free",
    tag: "For small teams",
    points: [
      "Up to 2 active projects",
      "Dashboard overview",
      "Basic CRM & clients",
      "Worker attendance",
    ],
  },
  {
    name: "Pro",
    price: "PKR 4,999/mo",
    tag: "Full operations",
    featured: true,
    points: [
      "Unlimited projects",
      "Finance & invoicing",
      "Materials & vendors",
      "Role-based access",
      "AI cost insights",
    ],
  },
];

export function Pricing() {
  return (
    <>
      {/* ── Services section (replaces old pricing section) ── */}
      <section className="py-32 bg-surface-lowest">
        <div className="max-w-7xl mx-auto px-8 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">

            {/* Left: blueprint image */}
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-56 h-56 border-t-2 border-l-2 border-gold/15 pointer-events-none" />
              <img
                alt="Architectural blueprints"
                className="relative z-10 w-full h-[560px] object-cover grayscale"
                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&q=80"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-gold/15 pointer-events-none" />
            </div>

            {/* Right: service list */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-10 bg-gold" />
                <span className="text-xs uppercase tracking-[0.3em] text-gold font-headline font-bold">Capabilities</span>
              </div>
              <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter text-[#e5e2e1] uppercase mb-12">
                Built for the Field<br />
                <span className="text-gold">and</span> the Boardroom.
              </h2>

              <div className="space-y-10">
                {services.map((s) => (
                  <div key={s.title} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-gold text-gold text-xl">
                      {s.icon}
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-base text-[#e5e2e1] uppercase tracking-tight mb-2">
                        {s.title}
                      </h4>
                      <p className="text-[#d0c5af] font-light leading-relaxed text-sm">
                        {s.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing tiers ── */}
      <section id="pricing" className="py-32 px-8 md:px-12 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-10 bg-gold" />
              <span className="text-xs uppercase tracking-[0.3em] text-gold font-headline font-bold">Pricing</span>
              <div className="h-px w-10 bg-gold" />
            </div>
            <h2 className="font-headline text-4xl font-extrabold uppercase tracking-tight text-[#e5e2e1]">
              Start Simple. Scale Up.
            </h2>
            <div className="w-20 h-0.5 gold-gradient mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`p-10 relative ${
                  tier.featured
                    ? "border border-gold/40 bg-surface-high"
                    : "border border-white/8 bg-surface-low"
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-8">
                    <span className="gold-gradient text-[#3d2f00] text-[10px] font-bold uppercase tracking-widest px-4 py-1 font-headline">
                      Most Popular
                    </span>
                  </div>
                )}
                <p className="text-xs uppercase tracking-[0.3em] text-[#99907c] font-headline font-bold mb-3">
                  {tier.tag}
                </p>
                <p className="text-xs uppercase tracking-widest text-gold font-headline font-bold mb-1">
                  {tier.name}
                </p>
                <p className="font-headline text-4xl font-extrabold text-[#e5e2e1] tracking-tighter mt-2 mb-8">
                  {tier.price}
                </p>
                <ul className="space-y-3 mb-10">
                  {tier.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-3 text-sm text-[#d0c5af]">
                      <span className="inline-block w-1.5 h-1.5 bg-gold flex-shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth"
                  className={`w-full block text-center py-4 text-xs font-bold uppercase tracking-widest font-headline transition-transform active:scale-95 ${
                    tier.featured
                      ? "gold-gradient text-[#3d2f00]"
                      : "border border-gold/30 text-gold hover:bg-gold/5 transition-colors"
                  }`}
                >
                  {tier.featured ? "Start Building" : "Get Started Free"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
