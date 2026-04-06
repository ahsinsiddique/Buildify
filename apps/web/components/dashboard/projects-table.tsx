type ProjectRow = {
  id: number;
  name: string;
  budget: string;
  progress?: string;
  status?: string;
  spent?: string;
};

export function ProjectsTable({ rows = [] }: { rows?: ProjectRow[] }) {
  const projects = rows.length
    ? rows.map((project) => ({
        id: project.id,
        name: project.name,
        budget: project.budget,
        progress: project.progress ?? "-",
        status: project.status ?? `Spent PKR ${project.spent ?? "0"}`,
        spent: project.spent ?? "0"
      }))
    : [];

  return (
    <div className="border border-white/5 bg-surface-container p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-[0.35em] text-on-surface-variant font-bold">Projects</p>
          <h3 className="mt-2 font-headline font-black text-2xl text-on-surface">Active Portfolio</h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr>
              {["Name", "Budget", "Progress", "Status"].map((h) => (
                <th key={h} className="pb-4 text-[9px] font-bold uppercase tracking-[0.3em] text-on-surface-variant">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.length ? (
              projects.map((project) => (
                <tr key={project.id} className="border-t border-white/5 text-sm text-on-surface-variant hover:bg-white/3 transition-colors">
                  <td className="py-4 font-bold text-on-surface pr-4">{project.name}</td>
                  <td className="py-4 pr-4">{project.budget}</td>
                  <td className="py-4 pr-4">{project.progress}</td>
                  <td className="py-4">{project.status}</td>
                </tr>
              ))
            ) : (
              <tr className="border-t border-white/5">
                <td className="py-6 text-sm text-on-surface-variant" colSpan={4}>
                  No project data yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
