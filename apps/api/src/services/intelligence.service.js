import { db } from "../config/db.js";

function toNumber(value) {
  return Number(value ?? 0);
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function buildSuggestion({ overrunRisk, materialVariancePercent, projectedDelayDays }) {
  const suggestions = [];

  if (materialVariancePercent > 10) {
    suggestions.push(
      `Reduce cement and core material usage by ${Math.min(Math.round(materialVariancePercent / 2), 10)}%`
    );
  }

  if (overrunRisk === "high") {
    suggestions.push(
      "Freeze non-essential purchases and review contractor-heavy expense lines this week"
    );
  }

  if (projectedDelayDays > 0) {
    suggestions.push(
      `Project likely delayed by ${projectedDelayDays} day(s); add labor coverage to recover the schedule`
    );
  }

  if (!suggestions.length) {
    suggestions.push("Maintain current pacing and review material drawdown every 3 days");
  }

  return suggestions;
}

export async function getProjectIntelligence() {
  const result = await db.query(`
    SELECT
      p.id,
      p.name,
      p.budget,
      p.status,
      p.start_date,
      p.end_date,
      p.progress_percent,
      COALESCE(SUM(DISTINCT e.amount), 0) AS spent,
      COALESCE(SUM(mu.quantity * m.price_per_unit), 0) AS material_cost
    FROM projects p
    LEFT JOIN expenses e ON e.project_id = p.id
    LEFT JOIN material_usage mu ON mu.project_id = p.id
    LEFT JOIN materials m ON m.id = mu.material_id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `);

  const today = new Date();

  const projects = result.rows.map((row) => {
    const budget = toNumber(row.budget);
    const spent = toNumber(row.spent);
    const progressPercent = toNumber(row.progress_percent);
    const materialCost = toNumber(row.material_cost);
    const materialShare = spent > 0 ? (materialCost / spent) * 100 : 0;
    const projectedTotalCost =
      progressPercent > 0 ? (spent / Math.max(progressPercent, 1)) * 100 : spent;
    const overrunPercent = budget > 0 ? ((projectedTotalCost - budget) / budget) * 100 : 0;
    const overrunRisk =
      overrunPercent > 12 ? "high" : overrunPercent > 0 ? "medium" : "low";
    const materialVariancePercent = materialShare > 55 ? materialShare - 55 : 0;

    let projectedDelayDays = 0;

    if (row.end_date && row.start_date) {
      const startDate = new Date(row.start_date);
      const endDate = new Date(row.end_date);
      const totalDurationDays = Math.max(
        1,
        Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000)
      );
      const elapsedDays = Math.max(
        1,
        Math.ceil((today.getTime() - startDate.getTime()) / 86400000)
      );
      const expectedProgress = Math.min((elapsedDays / totalDurationDays) * 100, 100);
      projectedDelayDays =
        progressPercent < expectedProgress
          ? Math.ceil(((expectedProgress - progressPercent) / 100) * totalDurationDays)
          : 0;
    }

    const flags = [
      overrunRisk !== "low" ? "Budget overrun risk" : null,
      materialVariancePercent > 10 ? "Material wastage signal" : null,
      projectedDelayDays > 0 ? "Schedule delay likely" : null
    ].filter(Boolean);

    return {
      id: row.id,
      name: row.name,
      status: row.status,
      budget,
      spent,
      progressPercent: round(progressPercent),
      projectedTotalCost: round(projectedTotalCost),
      overrunPercent: round(overrunPercent),
      overrunRisk,
      materialVariancePercent: round(materialVariancePercent),
      projectedDelayDays,
      suggestions: buildSuggestion({
        overrunRisk,
        materialVariancePercent,
        projectedDelayDays
      }),
      flags
    };
  });

  return {
    summary: {
      analyzedProjects: projects.length,
      flaggedProjects: projects.filter((project) => project.flags.length).length,
      highRiskProjects: projects.filter((project) => project.overrunRisk === "high").length
    },
    projects
  };
}
