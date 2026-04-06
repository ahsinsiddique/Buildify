type StatCardProps = {
  title: string;
  value: string;
  accent: string;
};

export function StatCard({ title, value, accent }: StatCardProps) {
  return (
    <div className="border border-white/5 bg-surface-container p-6">
      <p className="text-[9px] uppercase tracking-[0.35em] text-on-surface-variant font-bold">{title}</p>
      <p className={`mt-4 text-4xl font-headline font-black ${accent}`}>{value}</p>
    </div>
  );
}
