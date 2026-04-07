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

/** Watches the <html> dark class and returns chart-safe color values */
function useChartColors() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return {
    grid:         isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)",
    tick:         isDark ? "#d0c5af"                : "#5c5349",
    tooltipBg:    isDark ? "rgba(17,17,17,0.97)"   : "rgba(250,248,244,0.97)",
    tooltipBorder:isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.08)",
    tooltipColor: isDark ? "#e5e2e1"                : "#1a1714",
  };
}

export function DashboardOverview() {
  const { session } = useAuth();
  const [stats, setStats] = useState<DashboardStats>(fallbackStats);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const chart = useChartColors();

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
        accent: "text-primary"
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
        <div className="border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="border border-on-surface/7 bg-surface-container p-6">
          <div className="mb-6">
            <p className="text-[9px] uppercase tracking-[0.35em] text-on-surface-variant font-bold">Analytics</p>
            <h3 className="mt-2 font-headline font-black text-2xl text-on-surface">Daily expenses</h3>
          </div>

          <div className="h-72">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={spendingTrend}>
                <CartesianGrid stroke={chart.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis axisLine={false} dataKey="day" tickLine={false} tick={{ fill: chart.tick, fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: chart.tick, fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: chart.tooltipBg,
                    border: `1px solid ${chart.tooltipBorder}`,
                    borderRadius: "0px",
                    color: chart.tooltipColor,
                  }}
                />
                <Bar dataKey="total" fill="#f3ca50" radius={[0, 0, 0, 0]} />
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
