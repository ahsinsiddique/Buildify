import Link from "next/link";

import appConfig from "@/lib/app-config";

const highlights = [
  { label: "Active Projects", value: "Tracked Live" },
  { label: "Labor Costs", value: "Auto-Computed" },
  { label: "Invoices", value: "Linked to Clients" },
];

export function Hero() {
  return (
    <header className="relative h-screen w-full overflow-hidden flex items-center">
      {/* Background image + overlay */}
      <div className="absolute inset-0 z-0">
        <img
          alt="Construction site at golden hour"
          className="w-full h-full object-cover opacity-50"
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e] via-[#131313]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-5xl">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-3 mb-8">
          <div className="h-px w-12 bg-gold" />
          <span className="text-xs uppercase tracking-[0.3em] text-gold font-headline font-bold">
            {appConfig.appTag}
          </span>
        </div>

        <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[0.9] text-[#e5e2e1] mb-8">
          Build Your<br />
          <span className="text-gold">Legacy.</span><br />
          Track Every Brick.
        </h1>

        <p className="text-base md:text-xl text-[#d0c5af] max-w-2xl mb-12 font-light tracking-wide leading-relaxed">
          Replace scattered spreadsheets with one powerful ERP — plots, projects,
          labor, materials, invoicing, and site-level reporting unified in a single control panel.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 mb-16">
          <Link
            href="/auth"
            className="gold-gradient text-[#3d2f00] px-10 py-5 font-headline font-bold uppercase tracking-widest text-sm transition-transform active:scale-95 inline-flex items-center justify-center"
          >
            Enter Dashboard
          </Link>
          <a
            href="#features"
            className="border border-gold/30 text-gold px-10 py-5 font-headline font-bold uppercase tracking-widest text-sm hover:bg-gold/5 transition-colors inline-flex items-center justify-center"
          >
            Explore Features
          </a>
        </div>

        {/* Stat strip */}
        <div className="flex flex-wrap gap-8">
          {highlights.map((h) => (
            <div key={h.label} className="border-l-2 border-gold/30 pl-4">
              <p className="text-gold font-headline font-bold text-sm">{h.value}</p>
              <p className="text-[#99907c] text-xs uppercase tracking-widest mt-0.5">{h.label}</p>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
