"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Search, Filter, ChevronDown, Receipt, Building2, User, Calendar,
  Banknote, TrendingUp, FileText, HardHat, CheckCircle2, Clock, AlertCircle
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { useAuth } from "@/components/auth/auth-provider";
import {
  fetchInvoices,
  fetchInvoiceDetail,
  createResource,
  updateResource,
  deleteResource,
  listResource,
  InvoiceListItem,
  InvoiceDetail,
  InvoiceExpense,
  SelectOption,
} from "@/lib/api";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Status helpers ──────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  Paid:    "bg-emerald-50 text-emerald-700 border-emerald-100",
  paid:    "bg-emerald-50 text-emerald-700 border-emerald-100",
  Unpaid:  "bg-amber-50  text-amber-700  border-amber-100",
  unpaid:  "bg-amber-50  text-amber-700  border-amber-100",
  Partial: "bg-blue-50   text-blue-700   border-blue-100",
  partial: "bg-blue-50   text-blue-700   border-blue-100",
  Overdue: "bg-red-50    text-red-700    border-red-100",
  overdue: "bg-red-50    text-red-700    border-red-100",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border",
      STATUS_STYLES[status] ?? "bg-ink/5 text-ink/60 border-ink/10"
    )}>
      {status}
    </span>
  );
}

// ── Detail Modal ─────────────────────────────────────────────────────────────

function InvoiceDetailModal({
  invoiceId,
  onClose,
}: {
  invoiceId: number;
  onClose: () => void;
}) {
  const { session } = useAuth();
  const [detail, setDetail] = useState<InvoiceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters for expense grid
  const [searchQ, setSearchQ]           = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterWorker, setFilterWorker]  = useState("all");

  useEffect(() => {
    if (!session?.token) return;
    setLoading(true);
    fetchInvoiceDetail(invoiceId, session.token)
      .then(setDetail)
      .catch(() => setDetail(null))
      .finally(() => setLoading(false));
  }, [invoiceId, session?.token]);

  const inv = detail?.invoice;
  const expenses = detail?.expenses ?? [];

  const filteredExpenses = expenses.filter((e) => {
    if (filterCategory !== "all" && e.category !== filterCategory) return false;
    if (filterWorker   !== "all" && String(e.worker_id) !== filterWorker) return false;
    if (searchQ) {
      const q = searchQ.toLowerCase();
      if (
        !e.description?.toLowerCase().includes(q) &&
        !e.worker_name?.toLowerCase().includes(q) &&
        !e.category.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });

  const uniqueCategories = [...new Set(expenses.map((e) => e.category))];
  const uniqueWorkers = expenses
    .filter((e) => e.worker_id)
    .reduce<Array<{ id: string; name: string }>>((acc, e) => {
      if (!acc.find((w) => w.id === String(e.worker_id))) {
        acc.push({ id: String(e.worker_id), name: e.worker_name ?? `Worker #${e.worker_id}` });
      }
      return acc;
    }, []);

  const balance = inv ? Number(inv.total_amount) - Number(inv.amount_paid) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 16 }}
        className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/40 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(54,88,71,0.88))] px-6 pt-6 pb-5 text-white shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>

          {loading ? (
            <p className="text-white/60 text-sm">Loading invoice…</p>
          ) : inv ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50 font-semibold flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5" /> Invoice Detail
                </p>
                <h3 className="text-2xl font-display font-semibold mt-1">{inv.invoice_number}</h3>
                <p className="text-sm text-white/60 mt-0.5">
                  Issued {new Date(inv.issued_date).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" })}
                  {inv.due_date && ` · Due ${new Date(inv.due_date).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" })}`}
                </p>
                <div className="mt-3">
                  <StatusBadge status={inv.status} />
                </div>
              </div>
              <div className="flex gap-6 sm:text-right flex-wrap">
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-widest">Total</p>
                  <p className="text-2xl font-display font-bold text-white mt-0.5">
                    PKR {Number(inv.total_amount).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-widest">Paid</p>
                  <p className="text-2xl font-display font-bold text-emerald-300 mt-0.5">
                    PKR {Number(inv.amount_paid).toLocaleString()}
                  </p>
                </div>
                {balance > 0 && (
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-widest">Balance</p>
                    <p className="text-2xl font-display font-bold text-amber-300 mt-0.5">
                      PKR {balance.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-red-300 text-sm">Failed to load invoice details.</p>
          )}
        </div>

        {/* ── Info cards ── */}
        {inv && !loading && (
          <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0 border-b border-ink/8 bg-ink/[0.015]">
            {/* Client */}
            <div className="rounded-2xl border border-ink/8 bg-white p-4 flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-ink/5 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-ink/50" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-ink/40 font-semibold">Client</p>
                <p className="font-semibold text-ink mt-0.5">{inv.client_name ?? "—"}</p>
                {inv.client_phone && <p className="text-xs text-ink/50 mt-0.5">{inv.client_phone}</p>}
                {inv.client_email && <p className="text-xs text-ink/50">{inv.client_email}</p>}
              </div>
            </div>

            {/* Project */}
            <div className="rounded-2xl border border-ink/8 bg-white p-4 flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-ink/5 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-ink/50" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] uppercase tracking-widest text-ink/40 font-semibold">Project</p>
                <p className="font-semibold text-ink mt-0.5">{inv.project_name ?? "—"}</p>
                <div className="flex gap-3 mt-1">
                  {inv.project_status && <StatusBadge status={inv.project_status} />}
                  {inv.project_budget && (
                    <span className="text-xs text-ink/50">Budget: PKR {Number(inv.project_budget).toLocaleString()}</span>
                  )}
                </div>
                {inv.project_progress != null && (
                  <div className="mt-2">
                    <div className="h-1.5 rounded-full bg-ink/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-moss"
                        style={{ width: `${inv.project_progress}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-ink/40 mt-0.5">{inv.project_progress}% complete</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Expense grid with filters ── */}
        {!loading && (
          <>
            {/* Filter bar */}
            <div className="px-6 py-3 border-b border-ink/8 shrink-0 flex flex-wrap gap-2 items-center bg-white">
              <p className="text-xs font-bold uppercase tracking-widest text-ink/40 mr-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> Project Expenses
              </p>

              <div className="relative flex-1 min-w-[150px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink/40" />
                <input
                  type="text"
                  placeholder="Search…"
                  className="w-full bg-ink/5 border border-ink/10 rounded-xl pl-8 pr-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-moss/20 focus:border-moss/30"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-ink/40" />
                <select
                  className="bg-ink/5 border border-ink/10 rounded-xl pl-7 pr-6 py-1.5 text-xs outline-none appearance-none"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {uniqueCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-ink/40 pointer-events-none" />
              </div>

              {uniqueWorkers.length > 0 && (
                <div className="relative">
                  <HardHat className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-ink/40" />
                  <select
                    className="bg-ink/5 border border-ink/10 rounded-xl pl-7 pr-6 py-1.5 text-xs outline-none appearance-none"
                    value={filterWorker}
                    onChange={(e) => setFilterWorker(e.target.value)}
                  >
                    <option value="all">All Workers</option>
                    {uniqueWorkers.map((w) => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-ink/40 pointer-events-none" />
                </div>
              )}
            </div>

            {/* Grid */}
            <div className="overflow-y-auto flex-1">
              {filteredExpenses.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-ink/30 gap-2">
                  <FileText className="w-7 h-7 opacity-40" />
                  <p className="text-sm">No expenses match the filters</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white border-b border-ink/8">
                    <tr>
                      {["Date", "Category", "Worker", "Description", "Amount"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-[11px] uppercase tracking-widest text-ink/40 font-bold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map((e, i) => (
                      <tr
                        key={e.id}
                        className={cn(
                          "border-b border-ink/5 hover:bg-moss/5 transition-colors",
                          i % 2 === 0 ? "bg-white" : "bg-ink/[0.012]"
                        )}
                      >
                        <td className="px-5 py-3 whitespace-nowrap text-ink/60">
                          {new Date(e.expense_date).toLocaleDateString("en-PK", {
                            day: "2-digit", month: "short", year: "numeric"
                          })}
                        </td>
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-ink/5 text-ink/70">
                            {e.category}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-ink/70">
                          {e.worker_name ? (
                            <span className="flex items-center gap-1.5">
                              <HardHat className="w-3 h-3 text-moss shrink-0" />
                              {e.worker_name}
                              {e.worker_role && (
                                <span className="text-ink/40 text-[11px]">· {e.worker_role}</span>
                              )}
                            </span>
                          ) : <span className="text-ink/30">—</span>}
                        </td>
                        <td className="px-5 py-3 text-ink/60 max-w-[200px] truncate">
                          {e.description ?? <span className="text-ink/30">—</span>}
                        </td>
                        <td className="px-5 py-3 font-display font-semibold text-moss whitespace-nowrap">
                          PKR {Number(e.amount).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-ink/8 bg-ink/[0.015] shrink-0 flex justify-between items-center">
              <span className="text-xs text-ink/40 font-medium">
                {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? "s" : ""}
              </span>
              <span className="text-sm font-display font-bold text-ink">
                Total: PKR {filteredExpenses.reduce((s, e) => s + Number(e.amount), 0).toLocaleString()}
              </span>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── InvoicesManager ───────────────────────────────────────────────────────────

type InvoiceRecord = InvoiceListItem & Record<string, unknown>;

export function InvoicesManager() {
  const { session } = useAuth();

  const [rows, setRows]         = useState<InvoiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]       = useState("");

  // Detail modal
  const [detailId, setDetailId] = useState<number | null>(null);

  // Table filters
  const [tableSearch, setTableSearch]   = useState("");
  const [tableStatus, setTableStatus]   = useState("all");

  // CRUD form
  const [formValues, setFormValues] = useState<Record<string, string>>({
    invoice_number: "", client_id: "", project_id: "",
    total_amount: "", status: "", issued_date: "", due_date: "",
  });
  const [editingId, setEditingId]     = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientOptions, setClientOptions] = useState<SelectOption[]>([]);
  const [projectOptions, setProjectOptions] = useState<SelectOption[]>([]);

  const canEdit   = session?.user.role === "admin" || session?.user.role === "manager" || session?.user.role === "accountant";
  const canDelete = session?.user.role === "admin";

  async function loadRows() {
    if (!session?.token) return;
    setIsLoading(true);
    try {
      const data = await fetchInvoices(session.token);
      setRows(data as InvoiceRecord[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load invoices");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadRows();
  }, [session?.token]);

  useEffect(() => {
    if (!session?.token) return;
    Promise.all([
      listResource<Record<string,unknown>>("/clients", session.token),
      listResource<Record<string,unknown>>("/projects", session.token),
    ]).then(([clients, projects]) => {
      setClientOptions(clients.map((c) => ({ label: String(c.name), value: String(c.id) })));
      setProjectOptions(projects.map((p) => ({ label: String(p.name), value: String(p.id) })));
    }).catch(() => {});
  }, [session?.token]);

  function resetForm() {
    setFormValues({ invoice_number: "", client_id: "", project_id: "", total_amount: "", status: "", issued_date: "", due_date: "" });
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.token) return;
    setIsSubmitting(true);
    setError("");
    const payload: Record<string, unknown> = {
      invoice_number: formValues.invoice_number || null,
      client_id:      formValues.client_id  ? Number(formValues.client_id)  : null,
      project_id:     formValues.project_id ? Number(formValues.project_id) : null,
      total_amount:   formValues.total_amount ? Number(formValues.total_amount) : null,
      status:         formValues.status || null,
      issued_date:    formValues.issued_date || null,
      due_date:       formValues.due_date || null,
    };
    try {
      if (editingId) {
        await updateResource("/invoices", editingId, session.token, payload);
      } else {
        await createResource("/invoices", session.token, payload);
      }
      resetForm();
      void loadRows();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!session?.token || !confirm("Delete this invoice?")) return;
    try {
      await deleteResource("/invoices", id, session.token);
      setRows((r) => r.filter((row) => row.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  function startEdit(row: InvoiceRecord) {
    setFormValues({
      invoice_number: String(row.invoice_number ?? ""),
      client_id:      row.client_id != null ? String(row.client_id) : "",
      project_id:     row.project_id != null ? String(row.project_id) : "",
      total_amount:   String(row.total_amount ?? ""),
      status:         String(row.status ?? ""),
      issued_date:    String(row.issued_date ?? "").split("T")[0],
      due_date:       row.due_date ? String(row.due_date).split("T")[0] : "",
    });
    setEditingId(row.id);
  }

  // Filtered table rows
  const displayed = rows.filter((r) => {
    if (tableStatus !== "all" && r.status?.toLowerCase() !== tableStatus.toLowerCase()) return false;
    if (tableSearch) {
      const q = tableSearch.toLowerCase();
      return (
        r.invoice_number?.toLowerCase().includes(q) ||
        r.client_name?.toLowerCase().includes(q) ||
        r.project_name?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">

      {/* ── CRUD form ── */}
      <section className="relative overflow-hidden rounded-[1.9rem] border border-black/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.78),rgba(255,247,235,0.95))] p-6 shadow-xl backdrop-blur">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(199,155,66,0.2),transparent_55%),radial-gradient(circle_at_top_right,rgba(54,88,71,0.14),transparent_40%)]" />
        <div className="relative">
          <div className="mb-5 inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.28em] text-moss">
            Billing
          </div>
          <h3 className="font-display text-4xl text-ink">Invoices</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Create and manage invoices linked to clients and projects.
          </p>
        </div>

        {!canEdit && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Your role can view but not edit invoices.
          </div>
        )}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
          {[
            { name: "invoice_number", label: "Invoice Number", type: "text", required: true },
            { name: "issued_date",    label: "Issued Date",    type: "date", required: true },
            { name: "due_date",       label: "Due Date",       type: "date" },
            { name: "total_amount",   label: "Total Amount",   type: "number", required: true },
          ].map((f) => (
            <label key={f.name} className="grid gap-2 text-sm text-slate-700">
              <span className="font-medium">{f.label}</span>
              <input
                required={f.required}
                type={f.type}
                className="rounded-2xl border border-black/10 bg-white/85 px-4 py-3 outline-none transition focus:border-moss focus:bg-white"
                value={formValues[f.name] ?? ""}
                onChange={(e) => setFormValues((v) => ({ ...v, [f.name]: e.target.value }))}
              />
            </label>
          ))}

          <label className="grid gap-2 text-sm text-slate-700">
            <span className="font-medium">Client</span>
            <select
              className="rounded-2xl border border-black/10 bg-white/85 px-4 py-3 outline-none transition focus:border-moss focus:bg-white"
              value={formValues.client_id}
              onChange={(e) => setFormValues((v) => ({ ...v, client_id: e.target.value }))}
            >
              <option value="">Select client</option>
              {clientOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>

          <label className="grid gap-2 text-sm text-slate-700">
            <span className="font-medium">Project</span>
            <select
              className="rounded-2xl border border-black/10 bg-white/85 px-4 py-3 outline-none transition focus:border-moss focus:bg-white"
              value={formValues.project_id}
              onChange={(e) => setFormValues((v) => ({ ...v, project_id: e.target.value }))}
            >
              <option value="">Select project</option>
              {projectOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>

          <label className="grid gap-2 text-sm text-slate-700">
            <span className="font-medium">Status</span>
            <select
              required
              className="rounded-2xl border border-black/10 bg-white/85 px-4 py-3 outline-none transition focus:border-moss focus:bg-white"
              value={formValues.status}
              onChange={(e) => setFormValues((v) => ({ ...v, status: e.target.value }))}
            >
              <option value="">Select status</option>
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
            </select>
          </label>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              className="rounded-2xl bg-[linear-gradient(135deg,#0f172a,#365847)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-moss/10 transition hover:-translate-y-px disabled:opacity-60"
              disabled={!canEdit || isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Saving…" : editingId ? "Update invoice" : "Create invoice"}
            </button>
            {editingId && (
              <button
                type="button"
                className="rounded-2xl border border-black/10 bg-white/70 px-5 py-3 text-sm transition hover:bg-white"
                onClick={resetForm}
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </section>

      {/* ── Enriched table ── */}
      <section className="rounded-[1.9rem] border border-black/10 bg-white/78 p-6 shadow-xl backdrop-blur flex flex-col gap-4">
        {/* Table filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Live Records</p>
            <h4 className="mt-1 font-display text-2xl text-ink">Browse invoices</h4>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink/40" />
              <input
                type="text"
                placeholder="Invoice, client, project…"
                className="bg-ink/5 border border-ink/10 rounded-xl pl-8 pr-3 py-2 text-xs outline-none focus:ring-2 focus:ring-moss/20"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
              />
            </div>
            {/* Status pills */}
            <div className="flex gap-1">
              {["all", "paid", "unpaid", "partial"].map((s) => (
                <button
                  key={s}
                  onClick={() => setTableStatus(s)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[11px] font-semibold capitalize transition",
                    tableStatus === s ? "bg-ink text-white" : "bg-ink/5 text-ink/60 hover:bg-ink/10"
                  )}
                >
                  {s === "all" ? "All" : s}
                </button>
              ))}
            </div>
            <div className="rounded-full border border-black/10 bg-white/75 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-slate-500">
              {displayed.length} records
            </div>
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="min-w-full text-left">
            <thead className="text-xs text-slate-500 border-b border-ink/8">
              <tr>
                {["Invoice #", "Client", "Project", "Amount", "Paid", "Status", "Date", ""].map((h) => (
                  <th key={h} className="pb-3 pr-4 font-semibold uppercase tracking-widest text-[11px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="py-6 text-sm text-slate-400">Loading…</td></tr>
              ) : displayed.length === 0 ? (
                <tr><td colSpan={8} className="py-6 text-sm text-slate-400">No invoices found.</td></tr>
              ) : displayed.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-black/5 text-sm text-slate-700 transition hover:bg-sand/50 cursor-pointer"
                  onClick={() => setDetailId(row.id)}
                >
                  <td className="py-3.5 pr-4 font-mono text-xs text-ink/70">{row.invoice_number}</td>
                  <td className="py-3.5 pr-4">{row.client_name ?? <span className="text-ink/30">—</span>}</td>
                  <td className="py-3.5 pr-4">{row.project_name ?? <span className="text-ink/30">—</span>}</td>
                  <td className="py-3.5 pr-4 font-semibold">PKR {Number(row.total_amount).toLocaleString()}</td>
                  <td className="py-3.5 pr-4 text-emerald-700 font-semibold">PKR {Number(row.amount_paid).toLocaleString()}</td>
                  <td className="py-3.5 pr-4"><StatusBadge status={row.status} /></td>
                  <td className="py-3.5 pr-4 text-ink/50 whitespace-nowrap">
                    {new Date(row.issued_date).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="py-3.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1.5">
                      <button
                        className="rounded-full border border-black/10 px-3 py-1 text-xs hover:bg-ink/5 transition"
                        disabled={!canEdit}
                        onClick={() => startEdit(row)}
                      >Edit</button>
                      <button
                        className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-700 disabled:opacity-50 hover:bg-red-50 transition"
                        disabled={!canDelete}
                        onClick={() => void handleDelete(row.id)}
                      >Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {detailId !== null && (
          <InvoiceDetailModal
            invoiceId={detailId}
            onClose={() => setDetailId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
