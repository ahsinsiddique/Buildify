import Link from "next/link";

const testimonials = [
  {
    quote:
      "Buildify didn't just digitize our workflow — it gave us complete financial clarity across six active construction sites. The invoice automation alone saved us 40 hours a month.",
    author: "Kamran Mirza",
    role: "Director, Mirza Construction Group",
  },
  {
    quote:
      "As a property developer, precision and transparency are non-negotiable. The project tracking and worker payment system is exactly what we needed at scale.",
    author: "Sana Rehman",
    role: "CEO, Prime Estates Pakistan",
  },
];

export function Cta() {
  return (
    <>
      {/* ── Testimonials ── */}
      <section className="py-32 px-8 md:px-12 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-10 bg-gold" />
              <span className="text-xs uppercase tracking-[0.3em] text-gold font-headline font-bold">Trust</span>
              <div className="h-px w-10 bg-gold" />
            </div>
            <h2 className="font-headline text-3xl font-bold uppercase tracking-widest text-[#e5e2e1]">
              Voices of Legacy
            </h2>
            <div className="w-20 h-0.5 gold-gradient mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
            {testimonials.map((t) => (
              <div key={t.author} className="p-12 md:p-16 bg-surface-low">
                <span className="text-gold text-5xl font-headline leading-none mb-6 block">"</span>
                <p className="text-xl md:text-2xl font-light italic leading-relaxed mb-10 text-[#e5e2e1]">
                  {t.quote}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-surface-high border border-gold/20 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-sm uppercase tracking-tighter text-[#e5e2e1]">{t.author}</p>
                    <p className="text-xs text-[#99907c] tracking-widest uppercase mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative py-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Modern building architecture"
            className="w-full h-full object-cover grayscale brightness-[0.15]"
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80"
          />
          <div className="absolute inset-0 bg-[#131313]/60" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-8 md:px-12">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-10 bg-gold" />
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-headline font-bold">Start Free</span>
            <div className="h-px w-10 bg-gold" />
          </div>
          <h2 className="font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#e5e2e1] mb-8 leading-[0.9]">
            The System That<br />
            <span className="text-gold">Runs Your Business.</span>
          </h2>
          <p className="text-[#d0c5af] text-lg mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Move your construction and property operations out of Excel. One login,
            full control — projects, finance, workers, invoicing, and insights.
          </p>
          <Link
            href="/auth"
            className="gold-gradient text-[#3d2f00] px-12 py-6 font-headline font-bold uppercase tracking-[0.2em] text-sm transition-transform hover:scale-105 active:scale-95 inline-block"
          >
            Enter Buildify Today
          </Link>
        </div>
      </section>
    </>
  );
}
