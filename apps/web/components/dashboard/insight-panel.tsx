export function InsightPanel() {
  return (
    <div className="border border-white/5 bg-[linear-gradient(160deg,rgba(10,10,10,0.98),rgba(26,26,10,0.95))] p-6 text-white">
      <p className="text-[9px] uppercase tracking-[0.4em] text-primary font-bold">Decision Support</p>
      <h3 className="mt-3 font-headline font-black text-2xl text-on-surface">Budget and timeline signals</h3>
      <div className="mt-6 space-y-4 text-sm text-on-surface-variant">
        <div className="border border-white/5 bg-white/3 p-4">
          Riverside Plaza material burn is 14% above the weekly estimate.
        </div>
        <div className="border border-white/5 bg-white/3 p-4">
          Lake View Villas remains on track if labor stays under 310 hours this week.
        </div>
        <div className="border border-white/5 bg-white/3 p-4">
          Two pending invoices should be escalated to the accountant today.
        </div>
      </div>
    </div>
  );
}
