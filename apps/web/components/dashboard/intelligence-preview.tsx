"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { ProjectIntelligence, fetchProjectIntelligence } from "@/lib/api";

const fallbackIntelligence: ProjectIntelligence = {
  summary: {
    analyzedProjects: 0,
    flaggedProjects: 0,
    highRiskProjects: 0
  },
  projects: []
};

export function IntelligencePreview() {
  const { session } = useAuth();
  const [data, setData] = useState<ProjectIntelligence>(fallbackIntelligence);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadIntelligence() {
      if (!session?.token) {
        return;
      }

      try {
        const nextData = await fetchProjectIntelligence(session.token);
        setData(nextData);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load intelligence");
      }
    }

    void loadIntelligence();
  }, [session?.token]);

  const topSignal =
    data.projects.find((project) => project.overrunRisk === "high") ??
    data.projects.find((project) => project.flags.length) ??
    data.projects[0];

  return (
    <section className="rounded-[1.9rem] border border-black/10 bg-[linear-gradient(160deg,rgba(15,23,42,0.97),rgba(54,88,71,0.9))] p-6 text-white shadow-2xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-white/60">Premium Feature</p>
          <h3 className="mt-3 font-display text-4xl">AI-Powered Project Intelligence</h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">
            Predict total project cost before completion, detect budget overruns and material wastage, and surface smart suggestions like reducing cement usage or recovering delay days.
          </p>
        </div>
        <Link
          className="inline-flex rounded-full bg-brass px-5 py-3 text-sm font-semibold text-ink transition hover:translate-y-[-1px]"
          href="/dashboard/intelligence"
        >
          Open Intelligence Hub
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-white/65">Projects analyzed</p>
          <p className="mt-2 text-3xl font-semibold">{data.summary.analyzedProjects}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-white/65">Flagged signals</p>
          <p className="mt-2 text-3xl font-semibold">{data.summary.flaggedProjects}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-white/65">High-risk projects</p>
          <p className="mt-2 text-3xl font-semibold">{data.summary.highRiskProjects}</p>
        </div>
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/10 p-5">
        {error ? (
          <p className="text-sm text-amber-200">{error}</p>
        ) : topSignal ? (
          <>
            <p className="text-sm uppercase tracking-[0.24em] text-white/50">Top signal</p>
            <h4 className="mt-2 text-2xl font-semibold">{topSignal.name}</h4>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-white/5 p-4 text-sm text-white/80">
                Projected cost: PKR {topSignal.projectedTotalCost.toLocaleString()}
              </div>
              <div className="rounded-2xl bg-white/5 p-4 text-sm text-white/80">
                Overrun risk: {topSignal.overrunRisk} ({topSignal.overrunPercent}%)
              </div>
              <div className="rounded-2xl bg-white/5 p-4 text-sm text-white/80">
                Delay signal: {topSignal.projectedDelayDays} day(s)
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
              Smart suggestion: {topSignal.suggestions[0]}
            </div>
          </>
        ) : (
          <p className="text-sm text-white/70">
            Add project expenses, material usage, and timelines to unlock intelligence signals.
          </p>
        )}
      </div>
    </section>
  );
}
