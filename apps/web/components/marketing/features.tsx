const features = [
  {
    title: "Project Control",
    description:
      "Track every active build with timelines, budgets, progress percentages, and daily work logs."
  },
  {
    title: "Finance Visibility",
    description:
      "Monitor invoices, expenses, payment status, and profitability from one reporting layer."
  },
  {
    title: "Field Operations",
    description:
      "Assign workers, monitor attendance, and review material usage per project or per day."
  },
  {
    title: "Property CRM",
    description:
      "Manage plots, buyers, clients, consultations, and follow-up records in the same system."
  }
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-moss">
            Core Modules
          </p>
          <h2 className="mt-3 font-display text-4xl text-ink">
            ERP coverage across projects, finance, and sales.
          </h2>
        </div>
        <p className="max-w-xl text-slate-700">
          The starter is organized for growth, so we can add alerts, AI insights,
          document storage, and mobile workflows without reworking the foundation.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-[1.75rem] border border-black/10 bg-white/65 p-6 shadow-sm backdrop-blur"
          >
            <p className="font-display text-2xl text-ink">{feature.title}</p>
            <p className="mt-3 leading-7 text-slate-700">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
