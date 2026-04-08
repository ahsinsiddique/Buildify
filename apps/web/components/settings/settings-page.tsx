"use client";

import { useEffect, useState } from "react";

import appConfig from "@/lib/app-config";
import { PLANS, Plan, SubscriptionRequest, subscriptionStore } from "@/lib/subscription-store";
import { useAuth } from "@/components/auth/auth-provider";
import { useTheme } from "@/components/theme-provider";

type Tab = "appearance" | "subscription" | "profile";

// ── Mini UI previews inside the theme selector cards ──────────────────────

function DarkPreview() {
  return (
    <div className="h-24 bg-[#0a0a0a] border border-white/10 mb-3 p-2.5 overflow-hidden">
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#f3ca50]" />
        <div className="h-1.5 w-16 bg-[#f3ca50]/60" />
      </div>
      <div className="h-1 w-full bg-white/8 mb-1" />
      <div className="h-1 w-3/4 bg-white/8 mb-2.5" />
      <div className="grid grid-cols-3 gap-1">
        <div className="h-5 bg-[#111111] border border-white/5" />
        <div className="h-5 bg-[#111111] border border-white/5" />
        <div className="h-5 bg-[#111111] border border-white/5" />
      </div>
    </div>
  );
}

function LightPreview() {
  return (
    <div className="h-24 bg-[#faf8f4] border border-black/10 mb-3 p-2.5 overflow-hidden">
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#b08a22]" />
        <div className="h-1.5 w-16 bg-[#b08a22]/60" />
      </div>
      <div className="h-1 w-full bg-black/8 mb-1" />
      <div className="h-1 w-3/4 bg-black/8 mb-2.5" />
      <div className="grid grid-cols-3 gap-1">
        <div className="h-5 bg-[#f2ede6] border border-black/8" />
        <div className="h-5 bg-[#f2ede6] border border-black/8" />
        <div className="h-5 bg-[#f2ede6] border border-black/8" />
      </div>
    </div>
  );
}

// ── Plan upgrade confirm modal ────────────────────────────────────────────

function UpgradeModal({
  plan,
  onConfirm,
  onCancel,
}: {
  plan: Plan;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const cfg = PLANS[plan];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/20 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md bg-surface-container border border-on-surface/10 shadow-2xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[9px] uppercase tracking-[0.5em] text-primary font-bold mb-4">
          Subscription Request
        </p>
        <h3 className="font-headline font-black text-2xl text-on-surface mb-2">
          Upgrade to {cfg.name}
        </h3>
        <p className="text-sm text-on-surface-variant mb-5 leading-relaxed">
          You're requesting the{" "}
          <strong className="text-on-surface">{cfg.name}</strong> plan at{" "}
          <strong className="text-on-surface">{cfg.priceLabel}</strong>
          {cfg.price > 0 ? " per month" : ""}. Your administrator will review
          and activate access within 24 hours.
        </p>

        <ul className="space-y-1.5 mb-5">
          {cfg.features.slice(0, 5).map((f) => (
            <li key={f} className="flex items-start gap-2 text-xs text-on-surface-variant">
              <span className="text-primary font-bold mt-0.5 shrink-0">✓</span>
              {f}
            </li>
          ))}
        </ul>

        <div className="border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-600 dark:text-amber-400 mb-6 leading-relaxed">
          Your request will remain <strong>pending</strong> until approved. You
          can check status in this Settings panel.
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-on-surface/10 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant hover:text-on-surface transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 gold-gradient text-[#3d2f00] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:scale-105 transition-transform"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function SettingsPage() {
  const { session } = useAuth();
  const { theme, toggle } = useTheme();

  const [tab, setTab] = useState<Tab>("appearance");
  const [currentPlan, setCurrentPlan] = useState<Plan>("free");
  const [pendingRequest, setPendingRequest] = useState<SubscriptionRequest | null>(null);
  const [upgradingTo, setUpgradingTo] = useState<Plan | null>(null);
  const [justSubmitted, setJustSubmitted] = useState(false);

  useEffect(() => {
    if (!session?.user.id) return;
    setCurrentPlan(subscriptionStore.getUserPlan(session.user.id));
    setPendingRequest(subscriptionStore.getUserPendingRequest(session.user.id));
  }, [session?.user.id]);

  function handleConfirm() {
    if (!session?.user || !upgradingTo) return;
    subscriptionStore.submitRequest(
      {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      },
      upgradingTo
    );
    setPendingRequest(subscriptionStore.getUserPendingRequest(session.user.id));
    setUpgradingTo(null);
    setJustSubmitted(true);
  }

  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: "appearance", icon: "◐", label: "Appearance" },
    { id: "subscription", icon: "★", label: "Subscription" },
    { id: "profile", icon: "◯", label: "Profile" },
  ];

  return (
    <div className="max-w-5xl space-y-8">
      {/* Page header */}
      <div>
        <p className="text-[9px] uppercase tracking-[0.5em] text-primary font-bold">
          User Preferences
        </p>
        <h1 className="mt-2 font-headline font-black text-4xl text-on-surface letter-spacing-custom">
          Settings
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Manage your appearance, subscription plan, and account profile.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-on-surface/10">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-6 py-3 text-[10px] font-bold uppercase tracking-[0.3em] transition-all border-b-2 -mb-px ${
              tab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-on-surface/40 hover:text-on-surface"
            }`}
          >
            <span className="mr-2 font-normal">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Appearance ──────────────────────────────────────────────── */}
      {tab === "appearance" && (
        <div className="space-y-8">
          <div>
            <p className="text-[9px] uppercase tracking-[0.4em] text-on-surface-variant font-bold mb-1">
              Color Theme
            </p>
            <p className="text-xs text-on-surface/40 mb-5">
              Select your preferred visual mode. Your choice is saved locally and applied on every visit.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
              {/* Dark */}
              <button
                onClick={() => theme !== "dark" && toggle()}
                className={`text-left border-2 p-4 transition-all ${
                  theme === "dark"
                    ? "border-primary"
                    : "border-on-surface/10 hover:border-on-surface/25"
                }`}
              >
                <DarkPreview />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-on-surface">MONOLITH Black</p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5 uppercase tracking-[0.2em]">
                      Dark
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 flex items-center justify-center text-[10px] font-black transition-all ${
                      theme === "dark"
                        ? "gold-gradient text-[#3d2f00]"
                        : "border border-on-surface/15"
                    }`}
                  >
                    {theme === "dark" ? "✓" : ""}
                  </div>
                </div>
              </button>

              {/* Light */}
              <button
                onClick={() => theme !== "light" && toggle()}
                className={`text-left border-2 p-4 transition-all ${
                  theme === "light"
                    ? "border-primary"
                    : "border-on-surface/10 hover:border-on-surface/25"
                }`}
              >
                <LightPreview />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-on-surface">Warm Limestone</p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5 uppercase tracking-[0.2em]">
                      Light
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 flex items-center justify-center text-[10px] font-black transition-all ${
                      theme === "light"
                        ? "gold-gradient text-[#3d2f00]"
                        : "border border-on-surface/15"
                    }`}
                  >
                    {theme === "light" ? "✓" : ""}
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="border-t border-on-surface/7 pt-6">
            <p className="text-[9px] uppercase tracking-[0.4em] text-on-surface-variant font-bold mb-3">
              Quick Toggle
            </p>
            <p className="text-xs text-on-surface-variant mb-4">
              You can also switch themes at any time from the{" "}
              <strong className="text-on-surface">navbar toggle button</strong> at the top of every
              dashboard page.
            </p>
            <div className="border border-on-surface/7 bg-surface-container inline-flex items-center gap-4 px-5 py-3">
              <span className="text-xs text-on-surface-variant">
                Currently:{" "}
                <strong className="text-on-surface capitalize">{theme}</strong>
              </span>
              <button
                onClick={toggle}
                className="gold-gradient text-[#3d2f00] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] hover:scale-105 transition-transform"
              >
                Switch to {theme === "dark" ? "Light" : "Dark"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Subscription ─────────────────────────────────────────────── */}
      {tab === "subscription" && (
        <div className="space-y-8">
          {/* Current plan banner */}
          <div className="border border-on-surface/7 bg-surface-container p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.4em] text-on-surface-variant font-bold">
                Current Plan
              </p>
              <h2 className="mt-1 font-headline font-black text-2xl text-on-surface">
                {PLANS[currentPlan].name}
              </h2>
              {pendingRequest && (
                <p className="mt-1.5 text-xs text-amber-500 font-medium">
                  ↑ Upgrade to {PLANS[pendingRequest.plan].name} pending admin approval
                </p>
              )}
              {justSubmitted && !pendingRequest && (
                <p className="mt-1.5 text-xs text-emerald-500 font-medium">
                  ✓ Request submitted — awaiting admin approval
                </p>
              )}
            </div>
            <div className="sm:text-right">
              <p className="font-headline font-black text-3xl text-on-surface">
                {PLANS[currentPlan].priceLabel}
              </p>
              <p className="text-xs text-on-surface-variant">
                {PLANS[currentPlan].billingNote}
              </p>
            </div>
          </div>

          {/* Plans grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(Object.entries(PLANS) as [Plan, PlanConfig][]).map(([planKey, plan]) => {
              const isActive = planKey === currentPlan;
              const isPending = pendingRequest?.plan === planKey;
              return (
                <div
                  key={planKey}
                  className={`relative border p-6 transition-all ${
                    plan.highlight
                      ? "border-primary/40 bg-primary/5"
                      : isActive
                        ? "border-on-surface/25 bg-surface-container-high"
                        : "border-on-surface/7 bg-surface-container"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-5">
                      <span className="gold-gradient text-[#3d2f00] text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <p className="text-[9px] uppercase tracking-[0.35em] text-on-surface-variant font-bold">
                    {plan.name}
                  </p>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="font-headline font-black text-3xl text-on-surface">
                      {plan.priceLabel}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">{plan.billingNote}</p>

                  <ul className="mt-5 space-y-2">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-xs text-on-surface-variant"
                      >
                        <span className="text-primary font-bold mt-0.5 shrink-0">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    {isActive ? (
                      <div className="border border-on-surface/20 px-4 py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                        Current Plan
                      </div>
                    ) : isPending ? (
                      <div className="border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500">
                        Pending Approval
                      </div>
                    ) : (
                      <button
                        onClick={() => setUpgradingTo(planKey)}
                        className="w-full gold-gradient text-[#3d2f00] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] hover:scale-105 transition-transform"
                      >
                        {planKey === "free" ? "Downgrade" : `Upgrade to ${plan.name}`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-on-surface/40 leading-relaxed">
            Subscription upgrades are activated upon admin approval. Billing is monthly.
            Contact your administrator to cancel or modify your plan.
          </p>
        </div>
      )}

      {/* ── Profile ──────────────────────────────────────────────────── */}
      {tab === "profile" && (
        <div className="space-y-5">
          <div className="border border-on-surface/7 bg-surface-container p-6">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              {/* Avatar */}
              <div className="w-16 h-16 gold-gradient flex items-center justify-center text-[#3d2f00] font-headline font-black text-2xl shrink-0">
                {session?.user.name?.charAt(0).toUpperCase() ?? "?"}
              </div>

              {/* Fields */}
              <div className="flex-1 grid gap-5 sm:grid-cols-2">
                {[
                  { label: "Full Name", value: session?.user.name },
                  { label: "Email Address", value: session?.user.email },
                  {
                    label: "Role",
                    value: session?.user.role
                      ? session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1)
                      : "—",
                  },
                  { label: "Active Plan", value: PLANS[currentPlan].name },
                  { label: "Application", value: `${appConfig.appName} ERP` },
                  { label: "Account ID", value: `#${session?.user.id}` },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[9px] uppercase tracking-[0.35em] text-on-surface-variant font-bold">
                      {label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-on-surface">{value ?? "—"}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border border-on-surface/7 bg-surface-container-high px-5 py-4">
            <p className="text-xs text-on-surface-variant leading-relaxed">
              To update your name, email, or password — contact your system administrator.
              Role and permission changes must be requested through the admin panel.
            </p>
          </div>
        </div>
      )}

      {/* Upgrade modal */}
      {upgradingTo && (
        <UpgradeModal
          plan={upgradingTo}
          onConfirm={handleConfirm}
          onCancel={() => setUpgradingTo(null)}
        />
      )}
    </div>
  );
}

// Re-export type so consumers can use it without importing from store directly
type PlanConfig = (typeof PLANS)[Plan];
