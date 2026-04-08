"use client";

import { useEffect, useState } from "react";

import {
  PLANS,
  Plan,
  SubscriptionRequest,
  UserSubscription,
  subscriptionStore,
} from "@/lib/subscription-store";
import { useAuth } from "@/components/auth/auth-provider";

// ── Helpers ────────────────────────────────────────────────────────────────

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysAgo(iso: string) {
  const diff = Math.round((Date.now() - new Date(iso).getTime()) / 86_400_000);
  return diff === 0 ? "Today" : diff === 1 ? "Yesterday" : `${diff}d ago`;
}

const PLAN_BADGE: Record<Plan, string> = {
  free:       "bg-on-surface/8 text-on-surface-variant",
  pro:        "bg-primary/15 text-primary",
  enterprise: "bg-moss/15 text-moss",
};

const STATUS_BADGE: Record<RequestStatus, string> = {
  pending:  "bg-amber-500/15 text-amber-500",
  approved: "bg-emerald-500/15 text-emerald-600",
  rejected: "bg-red-500/15 text-red-500",
};

type RequestStatus = SubscriptionRequest["status"];
type AdminTab = "pending" | "all" | "subscribers";

// ── Reject modal ───────────────────────────────────────────────────────────

function RejectModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: (note: string) => void;
  onCancel: () => void;
}) {
  const [note, setNote] = useState("");
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/25 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm bg-surface-container border border-on-surface/10 shadow-2xl p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-headline font-black text-lg text-on-surface mb-1">
          Reject Request
        </p>
        <p className="text-xs text-on-surface-variant mb-5">
          Optionally include a reason — it'll be visible to the requester.
        </p>
        <label className="block text-[9px] uppercase tracking-[0.35em] text-on-surface-variant font-bold mb-2">
          Reason
        </label>
        <textarea
          className="w-full border border-on-surface/10 bg-surface-container-high text-on-surface px-3 py-2.5 text-sm outline-none focus:border-primary min-h-[80px] resize-none transition"
          placeholder="e.g. Invalid payment documentation…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="flex gap-3 mt-5">
          <button
            onClick={onCancel}
            className="flex-1 border border-on-surface/10 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant hover:text-on-surface transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(note)}
            className="flex-1 border border-red-500/20 bg-red-500/10 text-red-500 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-red-500/20 transition"
          >
            Confirm Reject
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function AdminDashboard() {
  const { session } = useAuth();
  const [tab, setTab] = useState<AdminTab>("pending");
  const [requests, setRequests] = useState<SubscriptionRequest[]>([]);
  const [subscribers, setSubscribers] = useState<UserSubscription[]>([]);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  // Seed demo data and load on mount
  useEffect(() => {
    subscriptionStore.seedDemoData();
    refresh();
  }, []);

  function refresh() {
    setRequests(subscriptionStore.getRequests());
    setSubscribers(subscriptionStore.getAllSubscriptions());
  }

  function approve(id: string) {
    subscriptionStore.processRequest(id, "approved", session?.user.name ?? "Admin");
    refresh();
  }

  function reject(id: string, note: string) {
    subscriptionStore.processRequest(id, "rejected", session?.user.name ?? "Admin", note);
    setRejectingId(null);
    refresh();
  }

  // Gate: admins only
  if (session?.user.role !== "admin") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center border border-on-surface/7 bg-surface-container p-12 max-w-xs">
          <p className="text-5xl mb-5 text-on-surface-variant">⊘</p>
          <p className="font-headline font-black text-xl text-on-surface mb-2">Access Restricted</p>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            This panel is only accessible to <strong className="text-on-surface">admin</strong> accounts.
          </p>
        </div>
      </div>
    );
  }

  const pending  = requests.filter((r) => r.status === "pending");
  const approved = requests.filter((r) => r.status === "approved");
  const mrr      = subscribers.reduce((sum, s) => sum + PLANS[s.plan].price, 0);

  const stats = [
    { label: "Total Requests",      value: String(requests.length),       accent: "text-on-surface" },
    { label: "Pending Review",       value: String(pending.length),        accent: "text-amber-500"  },
    { label: "Active Subscribers",   value: String(subscribers.length),    accent: "text-emerald-500"},
    { label: "Monthly Revenue",      value: `PKR ${mrr.toLocaleString()}`, accent: "text-primary"    },
  ];

  const tabs: { id: AdminTab; label: string; count: number }[] = [
    { id: "pending",     label: "Pending",            count: pending.length     },
    { id: "all",         label: "All Requests",        count: requests.length    },
    { id: "subscribers", label: "Active Subscribers",  count: subscribers.length },
  ];

  const tableRows = tab === "pending" ? pending : tab === "all" ? requests : [];

  return (
    <div className="max-w-6xl space-y-8">
      {/* Header */}
      <div>
        <p className="text-[9px] uppercase tracking-[0.5em] text-primary font-bold">
          Admin Panel
        </p>
        <h1 className="mt-2 font-headline font-black text-4xl text-on-surface letter-spacing-custom">
          Subscription Management
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Review pending access requests, approve or reject plan upgrades, and monitor active
          subscriptions.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="border border-on-surface/7 bg-surface-container p-5">
            <p className="text-[9px] uppercase tracking-[0.35em] text-on-surface-variant font-bold">
              {s.label}
            </p>
            <p className={`mt-3 font-headline font-black text-3xl ${s.accent}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Pending alert */}
      {pending.length > 0 && (
        <div className="border border-amber-500/25 bg-amber-500/10 px-5 py-3 flex items-center gap-3">
          <span className="text-amber-500 text-lg">⚠</span>
          <p className="text-sm text-amber-600 dark:text-amber-400">
            <strong>{pending.length} request{pending.length > 1 ? "s" : ""}</strong> awaiting your
            review.
          </p>
        </div>
      )}

      {/* Tab bar */}
      <div className="flex border-b border-on-surface/10">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-3 text-[10px] font-bold uppercase tracking-[0.25em] transition-all border-b-2 -mb-px flex items-center gap-2 ${
              tab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-on-surface/40 hover:text-on-surface"
            }`}
          >
            {t.label}
            <span
              className={`px-1.5 py-0.5 text-[9px] font-black ${
                tab === t.id
                  ? "bg-primary/20 text-primary"
                  : "bg-on-surface/8 text-on-surface-variant"
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Requests table ─────────────────────────────────────────────── */}
      {(tab === "pending" || tab === "all") && (
        <div className="border border-on-surface/7 bg-surface-container overflow-hidden">
          {tableRows.length === 0 ? (
            <div className="p-16 text-center">
              <p className="text-4xl mb-4">✓</p>
              <p className="text-on-surface-variant text-sm">
                {tab === "pending"
                  ? "All caught up — no pending requests."
                  : "No subscription requests yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-on-surface/7">
                    {["User", "Requested Plan", "Submitted", "Status", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-4 text-[9px] font-bold uppercase tracking-[0.3em] text-on-surface-variant"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((req) => (
                    <tr
                      key={req.id}
                      className="border-t border-on-surface/5 hover:bg-on-surface/3 transition-colors"
                    >
                      {/* User */}
                      <td className="px-5 py-4">
                        <p className="font-bold text-sm text-on-surface">{req.userName}</p>
                        <p className="text-xs text-on-surface-variant">{req.userEmail}</p>
                        <p className="text-[9px] text-on-surface/30 uppercase tracking-[0.2em] mt-0.5">
                          {req.userRole}
                        </p>
                      </td>

                      {/* Plan */}
                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${PLAN_BADGE[req.plan]}`}
                        >
                          {PLANS[req.plan].name}
                        </span>
                        <p className="text-xs text-on-surface-variant mt-1">
                          {PLANS[req.plan].priceLabel}
                          {PLANS[req.plan].price > 0 ? "/mo" : ""}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4">
                        <p className="text-xs text-on-surface">{fmt(req.requestedAt)}</p>
                        <p className="text-[10px] text-on-surface/40 mt-0.5">
                          {daysAgo(req.requestedAt)}
                        </p>
                        {req.processedAt && (
                          <p className="text-[10px] text-on-surface/30 mt-1">
                            Processed {daysAgo(req.processedAt)}
                          </p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${STATUS_BADGE[req.status]}`}
                        >
                          {req.status}
                        </span>
                        {req.note && (
                          <p className="text-[10px] text-on-surface/40 mt-1.5 max-w-[140px] leading-relaxed">
                            {req.note}
                          </p>
                        )}
                        {req.processedBy && (
                          <p className="text-[9px] text-on-surface/30 mt-1">
                            by {req.processedBy}
                          </p>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        {req.status === "pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => approve(req.id)}
                              className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] border border-emerald-500/25 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setRejectingId(req.id)}
                              className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-on-surface/30">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Subscribers table ───────────────────────────────────────────── */}
      {tab === "subscribers" && (
        <div className="border border-on-surface/7 bg-surface-container overflow-hidden">
          {subscribers.length === 0 ? (
            <div className="p-16 text-center">
              <p className="text-on-surface-variant text-sm">No active subscribers yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-on-surface/7">
                    {["Account", "Plan", "Monthly Value", "Activated", "Expires", "Status"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-5 py-4 text-[9px] font-bold uppercase tracking-[0.3em] text-on-surface-variant"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub) => {
                    const isExpired = new Date(sub.expiresAt) < new Date();
                    const req = requests.find((r) => r.userId === sub.userId && r.status === "approved");
                    return (
                      <tr
                        key={sub.userId}
                        className="border-t border-on-surface/5 hover:bg-on-surface/3 transition-colors"
                      >
                        <td className="px-5 py-4">
                          {req ? (
                            <>
                              <p className="font-bold text-sm text-on-surface">{req.userName}</p>
                              <p className="text-xs text-on-surface-variant">{req.userEmail}</p>
                            </>
                          ) : (
                            <p className="text-sm text-on-surface">User #{sub.userId}</p>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${PLAN_BADGE[sub.plan]}`}
                          >
                            {PLANS[sub.plan].name}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-headline font-black text-sm text-on-surface">
                          {PLANS[sub.plan].price > 0
                            ? `PKR ${PLANS[sub.plan].price.toLocaleString()}`
                            : "—"}
                        </td>
                        <td className="px-5 py-4 text-xs text-on-surface-variant">
                          {fmt(sub.activatedAt)}
                        </td>
                        <td className="px-5 py-4 text-xs text-on-surface-variant">
                          {fmt(sub.expiresAt)}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${
                              isExpired
                                ? "bg-red-500/15 text-red-500"
                                : "bg-emerald-500/15 text-emerald-600"
                            }`}
                          >
                            {isExpired ? "Expired" : "Active"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Reject modal */}
      {rejectingId && (
        <RejectModal
          onConfirm={(note) => reject(rejectingId, note)}
          onCancel={() => setRejectingId(null)}
        />
      )}
    </div>
  );
}
