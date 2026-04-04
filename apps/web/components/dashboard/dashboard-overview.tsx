"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { useAuth } from "@/components/auth/auth-provider";
import { DashboardStats, fetchDashboardStats } from "@/lib/api";

import { IntelligencePreview } from "./intelligence-preview";
import { InsightPanel } from "./insight-panel";
import { ProjectsTable } from "./projects-table";
import { StatCard } from "./stat-card";

const fallbackStats: DashboardStats = {
  summary: {
    total_projects: "0",
    total_properties: "0",
    total_expenses: "0",
    total_invoiced: "0"
  },
  projectCosts: [],
  spendingTrend: []
};

export function DashboardOverview() {
  const { session } = useAuth();
  const [stats, setStats] = useState<DashboardStats>(fallbackStats);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (!session?.token) {
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const nextStats = await fetchDashboardStats(session.token);
        setStats(nextStats);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load stats");
      } finally {
        setIsLoading(false);
      }
    }

    void loadStats();
  }, [session?.token]);

  const statCards = useMemo(
    () => [
      {
        title: "Total Projects",
        value: stats.summary.total_projects,
        accent: "text-clay"
      },
      {
        title: "Total Properties",
        value: stats.summary.total_properties,
        accent: "text-moss"
      },
      {
        title: "Total Expenses",
        value: `PKR ${stats.summary.total_expenses ?? "0"}`,
        accent: "text-ink"
      },
      {
        title: "Total Invoiced",
        value: `PKR ${stats.summary.total_invoiced ?? "0"}`,
        accent: "text-brass"
      }
    ],
    [stats.summary]
  );

  const spendingTrend = useMemo(
    () =>
      stats.spendingTrend.map((item) => ({
        day: item.expense_date,
        total: Number(item.total)
      })),
    [stats.spendingTrend]
  );

  return (
    <main className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <StatCard
            key={card.title}
            accent={card.accent}
            title={card.title}
            value={isLoading ? "..." : card.value}
          />
        ))}
      </section>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[1.75rem] border border-black/10 bg-white/75 p-6 shadow-sm backdrop-blur">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Analytics</p>
            <h3 className="mt-2 font-display text-3xl text-ink">Daily expenses</h3>
          </div>

          <div className="h-72">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={spendingTrend}>
                <CartesianGrid stroke="#ddd6ce" strokeDasharray="3 3" vertical={false} />
                <XAxis axisLine={false} dataKey="day" tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#365847" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <InsightPanel />
      </section>

      <IntelligencePreview />

      <ProjectsTable rows={stats.projectCosts} />
    </main>
  );
}
