type StatCardProps = {
  title: string;
  value: string;
  accent: string;
};

export function StatCard({ title, value, accent }: StatCardProps) {
  return (
    <div className="rounded-[1.5rem] border border-black/10 bg-white/75 p-5 shadow-sm backdrop-blur">
      <p className="text-sm text-slate-500">{title}</p>
      <p className={`mt-3 text-4xl font-semibold ${accent}`}>{value}</p>
    </div>
  );
}
