import { db } from "../config/db.js";

export async function getDashboardStats() {
  const [summaryResult, projectCostResult, spendingTrendResult] = await Promise.all([
    db.query(`
      SELECT
        (SELECT COUNT(*) FROM projects) AS total_projects,
        (SELECT COUNT(*) FROM properties) AS total_properties,
        (SELECT COALESCE(SUM(amount), 0) FROM expenses) AS total_expenses,
        (SELECT COALESCE(SUM(total_amount), 0) FROM invoices) AS total_invoiced
    `),
    db.query(`
      SELECT p.id, p.name, p.budget, COALESCE(SUM(e.amount), 0) AS spent
      FROM projects p
      LEFT JOIN expenses e ON e.project_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT 6
    `),
    db.query(`
      SELECT expense_date, COALESCE(SUM(amount), 0) AS total
      FROM expenses
      GROUP BY expense_date
      ORDER BY expense_date DESC
      LIMIT 7
    `)
  ]);

  return {
    summary: summaryResult.rows[0],
    projectCosts: projectCostResult.rows,
    spendingTrend: spendingTrendResult.rows.reverse()
  };
}
