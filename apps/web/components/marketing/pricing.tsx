const tiers = [
  {
    name: "Starter",
    price: "Free",
    description: "For small teams validating one workflow.",
    points: "Up to 2 active projects, dashboard overview, basic CRM"
  },
  {
    name: "Pro",
    price: "$49/mo",
    description: "For builders managing operations daily.",
    points: "Unlimited projects, finance, materials, invoicing, role access"
  }
];

export function Pricing() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <div className="rounded-[2rem] border border-black/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.8),rgba(255,248,238,0.88))] p-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm uppercase tracking-[0.25em] text-clay">Pricing</p>
          <h2 className="mt-3 font-display text-4xl text-ink">
            Start simple, then grow into full operations control.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="rounded-[1.5rem] border border-black/10 bg-white p-6 shadow-sm"
            >
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                {tier.name}
              </p>
              <p className="mt-3 font-display text-4xl text-ink">{tier.price}</p>
              <p className="mt-3 text-slate-700">{tier.description}</p>
              <p className="mt-6 text-sm leading-6 text-slate-600">{tier.points}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
