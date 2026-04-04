type Column<T> = {
  key: keyof T;
  label: string;
};

type RecordTableProps<T extends Record<string, string>> = {
  title: string;
  eyebrow: string;
  rows: T[];
  columns: Column<T>[];
};

export function RecordTable<T extends Record<string, string>>({
  title,
  eyebrow,
  rows,
  columns
}: RecordTableProps<T>) {
  return (
    <div className="rounded-[1.75rem] border border-black/10 bg-white/75 p-6 shadow-sm backdrop-blur">
      <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{eyebrow}</p>
      <h3 className="mt-2 font-display text-3xl text-ink">{title}</h3>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="text-sm text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className="pb-3 font-medium">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t border-black/5 text-sm text-slate-700">
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={`py-4 ${column.key === columns[0]?.key ? "font-medium text-ink" : ""}`}
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
