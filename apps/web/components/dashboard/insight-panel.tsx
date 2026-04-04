export function InsightPanel() {
  return (
    <div className="rounded-[1.75rem] border border-black/10 bg-[linear-gradient(160deg,rgba(15,23,42,0.96),rgba(54,88,71,0.9))] p-6 text-white shadow-xl">
      <p className="text-sm uppercase tracking-[0.25em] text-white/60">Decision Support</p>
      <h3 className="mt-3 font-display text-3xl">Budget and timeline signals</h3>
      <div className="mt-6 space-y-4 text-sm text-white/80">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          Riverside Plaza material burn is 14% above the weekly estimate.
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          Lake View Villas remains on track if labor stays under 310 hours this week.
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          Two pending invoices should be escalated to the accountant today.
        </div>
      </div>
    </div>
  );
}
