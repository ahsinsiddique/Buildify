import { getDashboardStats } from "../services/dashboard.service.js";

export async function getStats(_req, res) {
  const result = await getDashboardStats();
  res.json(result);
}
