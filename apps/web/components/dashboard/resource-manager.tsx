"use client";

import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import {
  SelectOption,
  createResource,
  deleteResource,
  listResource,
  updateResource
} from "@/lib/api";

type FieldConfig = {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "select";
  required?: boolean;
  options?: ReadonlyArray<{ label: string; value: string }>;
  optionsPath?: string;
  optionLabelKey?: string;
  optionValueKey?: string;
  excludeOptionStatuses?: readonly string[];
};

type ResourceManagerProps = {
  title: string;
  eyebrow: string;
  path: string;
  fields: readonly FieldConfig[];
  columns: ReadonlyArray<{ key: string; label: string }>;
};

type ResourceRecord = Record<string, unknown> & { id: number };

function initialValues(fields: readonly FieldConfig[]) {
  return fields.reduce<Record<string, string>>((accumulator, field) => {
    accumulator[field.name] = "";
    return accumulator;
  }, {});
}

function normalizeValue(field: FieldConfig, value: string) {
  if (value === "") {
    return null;
  }

  if (field.type === "number") {
    return Number(value);
  }

  return value;
}

export function ResourceManager({
  title,
  eyebrow,
  path,
  fields,
  columns
}: ResourceManagerProps) {
  const { session } = useAuth();
  const [rows, setRows] = useState<ResourceRecord[]>([]);
  const [formValues, setFormValues] = useState<Record<string, string>>(() => initialValues(fields));
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, SelectOption[]>>({});

  useEffect(() => {
    async function loadRows() {
      if (!session?.token) {
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const nextRows = await listResource<ResourceRecord>(path, session.token);
        setRows(nextRows);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load records");
      } finally {
        setIsLoading(false);
      }
    }

    void loadRows();
  }, [path, session?.token]);

  useEffect(() => {
    async function loadDynamicOptions() {
      if (!session?.token) {
        return;
      }

      const optionFields = fields.filter((field) => field.optionsPath);

      if (!optionFields.length) {
        return;
      }

      try {
        const optionEntries = await Promise.all(
          optionFields.map(async (field) => {
            const records = await listResource<Record<string, unknown>>(
              field.optionsPath as string,
              session.token
            );

            const filteredRecords = field.excludeOptionStatuses?.length
              ? records.filter((record) => {
                  const status = String(record.status ?? "").toLowerCase();
                  return !field.excludeOptionStatuses?.includes(status);
                })
              : records;

            const mappedOptions = filteredRecords.map((record) => ({
              label: String(record[field.optionLabelKey ?? "name"] ?? `#${record.id}`),
              value: String(record[field.optionValueKey ?? "id"] ?? "")
            }));

            return [field.name, mappedOptions] as const;
          })
        );

        setDynamicOptions(Object.fromEntries(optionEntries));
      } catch (loadError) {
        setError(
          loadError instanceof Error ? loadError.message : "Failed to load form options"
        );
      }
    }

    void loadDynamicOptions();
  }, [fields, session?.token]);

  const canDelete = useMemo(() => session?.user.role === "admin", [session?.user.role]);
  const canEdit =
    session?.user.role === "admin" ||
    session?.user.role === "manager" ||
    session?.user.role === "accountant";

  function resetForm() {
    setFormValues(initialValues(fields));
    setEditingId(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session?.token) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    const payload = fields.reduce<Record<string, unknown>>((accumulator, field) => {
      accumulator[field.name] = normalizeValue(field, formValues[field.name] ?? "");
      return accumulator;
    }, {});

    try {
      if (editingId) {
        const updated = await updateResource<ResourceRecord>(
          path,
          editingId,
          session.token,
          payload
        );
        setRows((currentRows) =>
          currentRows.map((row) => (row.id === editingId ? updated : row))
        );
      } else {
        const created = await createResource<ResourceRecord>(path, session.token, payload);
        setRows((currentRows) => [created, ...currentRows]);
      }

      resetForm();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : "Failed to save record"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!session?.token) {
      return;
    }

    setError("");

    try {
      await deleteResource(path, id, session.token);
      setRows((currentRows) => currentRows.filter((row) => row.id !== id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete record");
    }
  }

  function startEdit(row: ResourceRecord) {
    const nextValues = fields.reduce<Record<string, string>>((accumulator, field) => {
      const value = row[field.name];
      accumulator[field.name] = value === null || value === undefined ? "" : String(value);
      return accumulator;
    }, {});

    setFormValues(nextValues);
    setEditingId(row.id);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="relative overflow-hidden rounded-[1.9rem] border border-black/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.78),rgba(255,247,235,0.95))] p-6 shadow-xl backdrop-blur">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(199,155,66,0.2),transparent_55%),radial-gradient(circle_at_top_right,rgba(54,88,71,0.14),transparent_40%)]" />
        <div className="relative">
          <div className="mb-5 inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.28em] text-moss">
            {eyebrow}
          </div>
          <h3 className="font-display text-4xl text-ink">{title}</h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Add new records, keep your contacts organized, and feed clean linked data into projects, invoices, and materials without typing raw IDs.
          </p>
        </div>

        {!canEdit ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Your current role can view records but cannot create or edit them.
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <label className="grid gap-2 text-sm text-slate-700" key={field.name}>
              <span className="font-medium">{field.label}</span>
              {field.type === "textarea" ? (
                <textarea
                  className="min-h-24 rounded-2xl border border-black/10 bg-white/85 px-4 py-3 outline-none transition focus:border-moss focus:bg-white"
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      [field.name]: event.target.value
                    }))
                  }
                  required={field.required}
                  value={formValues[field.name] ?? ""}
                />
              ) : field.type === "select" ? (
                <select
                  className="rounded-2xl border border-black/10 bg-white/85 px-4 py-3 outline-none transition focus:border-moss focus:bg-white"
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      [field.name]: event.target.value
                    }))
                  }
                  required={field.required}
                  value={formValues[field.name] ?? ""}
                >
                  <option value="">Select</option>
                  {[...(field.options ?? []), ...(dynamicOptions[field.name] ?? [])].map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="rounded-2xl border border-black/10 bg-white/85 px-4 py-3 outline-none transition focus:border-moss focus:bg-white"
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      [field.name]: event.target.value
                    }))
                  }
                  required={field.required}
                  type={field.type ?? "text"}
                  value={formValues[field.name] ?? ""}
                />
              )}
            </label>
          ))}

          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-2xl bg-[linear-gradient(135deg,#0f172a,#365847)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-moss/10 transition hover:translate-y-[-1px] disabled:opacity-60"
              disabled={!canEdit || isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Saving..." : editingId ? "Update record" : "Create record"}
            </button>
            {editingId ? (
              <button
                className="rounded-2xl border border-black/10 bg-white/70 px-5 py-3 text-sm transition hover:bg-white"
                onClick={resetForm}
                type="button"
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="rounded-[1.9rem] border border-black/10 bg-white/78 p-6 shadow-xl backdrop-blur">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Live Records</p>
            <h4 className="mt-2 font-display text-3xl text-ink">Browse and manage</h4>
          </div>
          <div className="rounded-full border border-black/10 bg-white/75 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-500">
            {rows.length} record{rows.length === 1 ? "" : "s"}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="text-sm text-slate-500">
              <tr>
                {columns.map((column) => (
                  <th className="pb-3 font-medium" key={column.key}>
                    {column.label}
                  </th>
                ))}
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr className="border-t border-black/5 text-sm text-slate-500">
                  <td className="py-4" colSpan={columns.length + 1}>
                    Loading records...
                  </td>
                </tr>
              ) : rows.length ? (
                rows.map((row) => (
                  <tr
                    className="border-t border-black/5 text-sm text-slate-700 transition hover:bg-sand/50"
                    key={row.id}
                  >
                    {columns.map((column) => (
                      <td className="py-4 pr-4 align-top" key={column.key}>
                        {String(row[column.key] ?? "-")}
                      </td>
                    ))}
                    <td className="py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="rounded-full border border-black/10 px-3 py-1 text-xs"
                          disabled={!canEdit}
                          onClick={() => startEdit(row)}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-700 disabled:opacity-50"
                          disabled={!canDelete}
                          onClick={() => void handleDelete(row.id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-t border-black/5 text-sm text-slate-500">
                  <td className="py-4" colSpan={columns.length + 1}>
                    No records found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
