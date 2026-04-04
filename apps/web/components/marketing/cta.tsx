export function Cta() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <div className="rounded-[2rem] bg-ink px-8 py-12 text-white">
        <p className="text-sm uppercase tracking-[0.25em] text-white/60">
          Start Free
        </p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-display text-4xl">
              Move your real estate and construction operations out of Excel.
            </h2>
            <p className="mt-3 max-w-2xl text-white/75">
              This starter gives us the foundation for CRM, projects, inventory,
              invoicing, reporting, and future AI cost insights.
            </p>
          </div>
          <a
            href="/auth"
            className="inline-flex rounded-full bg-brass px-6 py-3 text-sm font-semibold text-ink"
          >
            Start With Login
          </a>
        </div>
      </div>
    </section>
  );
}
