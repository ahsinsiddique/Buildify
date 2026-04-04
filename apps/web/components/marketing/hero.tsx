const highlights = [
  "Property inventory and buyer tracking",
  "Construction budgets, materials, and daily logs",
  "Invoices, expenses, and profitability analytics"
];

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
      <div className="space-y-8">
        <div className="inline-flex rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm backdrop-blur">
          Built for property dealers and construction teams
        </div>
        <div className="space-y-5">
          <p className="font-display text-5xl leading-tight text-ink sm:text-6xl">
            Manage your construction and property business in one place.
          </p>
          <p className="max-w-2xl text-lg leading-8 text-slate-700">
            Replace scattered spreadsheets with a single ERP for plots, projects,
            labor, materials, invoicing, and site-level reporting.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <a
            className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
            href="/auth"
          >
            Login To Dashboard
          </a>
          <a
            className="rounded-full border border-black/10 bg-white/60 px-6 py-3 text-sm font-semibold backdrop-blur"
            href="#features"
          >
            Explore Features
          </a>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-black/10 bg-white/55 p-4 text-sm text-slate-700 shadow-sm backdrop-blur"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] border border-black/10 bg-[linear-gradient(160deg,rgba(15,23,42,0.95),rgba(54,88,71,0.92))] p-6 text-white shadow-2xl">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                Project Snapshot
              </p>
              <p className="mt-2 text-2xl font-semibold">Lake View Villas</p>
            </div>
            <div className="rounded-full bg-white/10 px-3 py-1 text-sm">
              68% Complete
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-white/10 p-4">
              <div className="mb-2 flex items-center justify-between text-sm text-white/70">
                <span>Budget Used</span>
                <span>$182,400 / $260,000</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-2 w-[70%] rounded-full bg-brass" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-white/70">Materials This Week</p>
                <p className="mt-2 text-3xl font-semibold">128 units</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-white/70">Labor Cost</p>
                <p className="mt-2 text-3xl font-semibold">$14,600</p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-white/75">
              Daily insight: exterior brickwork is ahead of schedule, but steel
              usage is trending 11% above the estimate.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
