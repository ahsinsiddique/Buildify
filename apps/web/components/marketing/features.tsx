const modules = [
  {
    img: "https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?w=800&q=80",
    imgAlt: "Construction project site with cranes",
    tag: "Projects",
    title: "Full Project Control",
    description:
      "Track timelines, budgets, daily logs, and progress percentages across every active build — from foundation to finishing.",
    stat: "100% Budget Visibility",
  },
  {
    img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    imgAlt: "Financial documents and analytics",
    tag: "Finance",
    title: "Finance Intelligence",
    description:
      "Monitor invoices, expenses, payment status, and profitability from one reporting layer. Auto-generate invoices on worker payments.",
    stat: "Real-time P&L",
  },
  {
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    imgAlt: "Construction workers on site",
    tag: "Workforce",
    title: "Workforce Command",
    description:
      "Assign workers, track attendance, auto-compute salaries, manage vendor relationships, and log material usage per project.",
    stat: "Auto Salary Computation",
  },
];

export function Features() {
  return (
    <section id="features" className="py-32 px-8 md:px-12 bg-surface">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-gold" />
              <span className="text-xs uppercase tracking-[0.3em] text-gold font-headline font-bold">Platform</span>
            </div>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-[#e5e2e1] uppercase">
              Your Operations,<br />Unified.
            </h2>
            <p className="text-[#d0c5af] font-light mt-4">
              Every module purpose-built for construction and real estate professionals.
            </p>
          </div>
          <a
            href="/auth"
            className="text-gold font-bold uppercase tracking-widest text-xs border-b border-gold/40 pb-2 hover:border-gold transition-all whitespace-nowrap"
          >
            Enter Dashboard →
          </a>
        </div>

        {/* Module cards — staggered like MONOLITH */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {modules.map((mod, i) => (
            <div
              key={mod.tag}
              className={`bg-surface-high group ${i === 1 ? "md:mt-12" : ""}`}
            >
              {/* Image */}
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  alt={mod.imgAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0"
                  src={mod.img}
                />
              </div>

              {/* Card body */}
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gold font-headline font-bold mb-2">
                      {mod.tag}
                    </p>
                    <h3 className="font-headline text-xl font-bold text-[#e5e2e1]">
                      {mod.title}
                    </h3>
                  </div>
                </div>
                <p className="text-[#d0c5af] text-sm font-light leading-relaxed mb-6">
                  {mod.description}
                </p>
                <div className="border-t border-white/5 pt-5">
                  <span className="text-xs uppercase tracking-widest text-[#99907c] flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-gold" />
                    {mod.stat}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
