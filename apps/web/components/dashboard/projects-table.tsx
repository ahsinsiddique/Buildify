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
    <div className="rounded-[1.75rem] border border-black/10 bg-white/75 p-6 shadow-sm backdrop-blur">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Projects</p>
          <h3 className="mt-2 font-display text-3xl text-ink">Active portfolio</h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="text-sm text-slate-500">
            <tr>
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Budget</th>
              <th className="pb-3 font-medium">Progress</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.length ? (
              projects.map((project) => (
                <tr key={project.id} className="border-t border-black/5 text-sm text-slate-700">
                  <td className="py-4 font-medium text-ink">{project.name}</td>
                  <td className="py-4">{project.budget}</td>
                  <td className="py-4">{project.progress}</td>
                  <td className="py-4">{project.status}</td>
                </tr>
              ))
            ) : (
              <tr className="border-t border-black/5 text-sm text-slate-500">
                <td className="py-4" colSpan={4}>
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
