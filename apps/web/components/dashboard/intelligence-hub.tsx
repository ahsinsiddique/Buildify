"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, AlertTriangle, Lightbulb, Clock, PackageX, Target, Zap, TrendingUp, Info
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { useAuth } from "@/components/auth/auth-provider";
import { IntelligenceProject, ProjectIntelligence, fetchProjectIntelligence } from "@/lib/api";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const fallback: ProjectIntelligence = {
  summary: {
    analyzedProjects: 0,
    flaggedProjects: 0,
    highRiskProjects: 0
  },
  projects: []
};

function riskTone(risk: IntelligenceProject["overrunRisk"]) {
  if (risk === "high") {
    return "border-red-500/30 bg-red-500/10 text-red-400";
  }
  if (risk === "medium") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-400";
  }
  return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -4, transition: { duration: 0.3 } }}
    className={cn(
      "relative overflow-hidden p-6",
      "bg-surface-container border border-on-surface/7",
      "shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]",
      "transition-all duration-300",
      className
    )}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-on-surface/3 to-transparent pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </motion.div>
);

export function IntelligenceHub() {
  const { session } = useAuth();
  const [data, setData] = useState<ProjectIntelligence>(fallback);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!session?.token) return;
      setLoading(true);
      setError("");

      try {
        const next = await fetchProjectIntelligence(session.token);
        setData(next);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load intelligence");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [session?.token]);

  return (
    <div className="min-h-screen pb-20 pt-8" style={{ perspective: "1000px" }}>
      <motion.main 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Killer Feature Hero */}
        <motion.section 
          variants={itemVariants}
          className="relative overflow-hidden rounded-[2.5rem] p-10 md:p-14 text-white shadow-2xl border border-white/10"
        >
          <div className="absolute inset-0 bg-[linear-gradient(160deg,#0f172a,#2d4c3e)]" />
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-moss/50 via-transparent to-transparent mix-blend-screen" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <Brain className="w-4 h-4 text-emerald-400" />
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-emerald-100">AI Intelligence Core</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
              Predict. Prevent. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-brass">Optimize.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light">
              Detect budget overruns before they happen, eliminate material wastage, and get actionable smart suggestions to keep your projects perfectly on track.
            </p>
          </div>

          {/* Floating Stats Orbs */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            {[
              { label: "Active Analyzed", val: loading ? "..." : data.summary.analyzedProjects, icon: Target },
              { label: "AI Interventions", val: loading ? "..." : data.summary.flaggedProjects, icon: Zap },
              { label: "Critical Risks", val: loading ? "..." : data.summary.highRiskProjects, icon: AlertTriangle },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                <div className="p-3 bg-white/10 rounded-xl">
                  <stat.icon className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
                  <p className="text-3xl font-display font-semibold mt-1">{stat.val}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {error && (
          <motion.div variants={itemVariants} className="rounded-2xl border border-red-200 bg-red-50/80 backdrop-blur px-6 py-4 text-sm text-red-700 flex items-center gap-3">
             <AlertTriangle className="w-5 h-5 text-red-500" />
            {error}
          </motion.div>
        )}

        {/* Intelligence Feeds */}
        <div className="grid gap-8 mt-8">
          {data.projects.length ? (
            data.projects.map((project) => (
              <GlassCard key={project.id} className="p-0 overflow-hidden">
                <div className="grid lg:grid-cols-[1fr_380px] divide-y lg:divide-y-0 lg:divide-x divide-ink/5">
                  
                  {/* Left: Diagnostics & Metrics */}
                  <div className="p-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs uppercase tracking-[0.2em] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{project.status}</span>
                        </div>
                        <h2 className="font-display text-3xl font-bold text-ink">{project.name}</h2>
                      </div>
                      
                      {/* Flags Indicator */}
                      <div className="flex flex-wrap items-center gap-2">
                        {project.flags.length ? (
                          project.flags.map((flag) => (
                            <span
                              key={flag}
                              className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm",
                                riskTone(project.overrunRisk)
                              )}
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                              {flag}
                            </span>
                          ))
                        ) : (
                          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
                            <Target className="w-3.5 h-3.5" />
                            Stable Trajectory
                          </span>
                        )}
                      </div>
                    </div>

                    {/* AI Predicted Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white/50 border border-white p-4 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 text-ink/60 mb-2">
                          <TrendingUp className="w-4 h-4" />
                          <p className="text-xs font-bold uppercase tracking-wider">Projected Cost</p>
                        </div>
                        <p className="text-2xl font-display font-semibold text-ink">
                          ${(project.projectedTotalCost).toLocaleString()}
                        </p>
                      </div>

                      <div className="bg-white/50 border border-white p-4 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 text-red-600/80 mb-2">
                          <AlertTriangle className="w-4 h-4" />
                          <p className="text-xs font-bold uppercase tracking-wider">Budget Overrun</p>
                        </div>
                        <p className={cn(
                          "text-2xl font-display font-semibold",
                          project.overrunPercent > 0 ? "text-red-600" : "text-emerald-600"
                        )}>
                          {project.overrunPercent > 0 ? "+" : ""}{project.overrunPercent}%
                        </p>
                      </div>

                      <div className="bg-white/50 border border-white p-4 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 text-amber-600/80 mb-2">
                          <PackageX className="w-4 h-4" />
                          <p className="text-xs font-bold uppercase tracking-wider">Est. Wastage</p>
                        </div>
                        <p className="text-2xl font-display font-semibold text-ink">
                          {project.materialVariancePercent}%
                        </p>
                      </div>

                      <div className="bg-white/50 border border-white p-4 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 text-blue-600/80 mb-2">
                          <Clock className="w-4 h-4" />
                          <p className="text-xs font-bold uppercase tracking-wider">Delay Risk</p>
                        </div>
                        <p className="text-2xl font-display font-semibold text-ink">
                          {project.projectedDelayDays} <span className="text-base text-ink/50 font-medium">Days</span>
                        </p>
                      </div>
                    </div>

                    {/* Explainer / Heuristic details */}
                     <div className="mt-6 flex items-start gap-3 bg-ink/5 rounded-2xl p-4 border border-ink/5">
                        <Info className="w-5 h-5 text-ink/50 shrink-0 mt-0.5" />
                        <p className="text-sm text-ink/70 leading-relaxed font-medium">
                          Based on a <strong>${project.budget.toLocaleString()}</strong> budget and <strong>${project.spent.toLocaleString()}</strong> current spend at <strong>{project.progressPercent}%</strong> progress. Material insights are drawn from cost-share clustering compared to standard averages.
                        </p>
                      </div>
                  </div>

                  {/* Right: AI Smart Suggestions (The Brain) */}
                  <div className="bg-[linear-gradient(135deg,rgba(54,88,71,0.05),rgba(15,23,42,0.05))] p-8 flex flex-col items-center justify-center relative shadow-[inset_20px_0_40px_-20px_rgba(0,0,0,0.03)]">
                    <div className="absolute top-0 right-0 p-3 bg-gradient-to-bl from-moss/20 to-transparent rounded-bl-3xl opacity-50" />
                    
                    <div className="w-full">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-br from-moss to-ink text-white rounded-xl shadow-lg shadow-moss/20">
                          <Brain className="w-5 h-5" />
                        </div>
                        <h3 className="font-display text-xl font-bold text-ink">Smart Suggestions</h3>
                      </div>
                      
                      <div className="grid gap-3 w-full">
                        {project.suggestions.map((suggestion, idx) => (
                          <motion.div
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-sm border border-white hover:shadow-md transition-all group"
                          >
                            <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 group-hover:text-amber-600 transition-colors" />
                            <p className="text-sm text-ink/80 font-medium leading-relaxed">{suggestion}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </GlassCard>
            ))
          ) : (
            <GlassCard className="text-center py-16">
              <div className="mx-auto w-16 h-16 bg-ink/5 rounded-full flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-ink/30" />
              </div>
              <h3 className="text-xl font-display font-semibold text-ink">Intelligence Engine Idle</h3>
              <p className="text-ink/60 mt-2 max-w-md mx-auto">
                Add projects, expenses, material usage, and daily logs to unlock predictive intelligence and risk analysis signals.
              </p>
            </GlassCard>
          )}
        </div>
      </motion.main>
    </div>
  );
}
