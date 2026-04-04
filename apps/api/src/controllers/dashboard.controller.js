import { getDashboardStats } from "../services/dashboard.service.js";
import { getProjectIntelligence } from "../services/intelligence.service.js";

export async function getStats(_req, res) {
  const result = await getDashboardStats();
  res.json(result);
}

export async function getIntelligence(_req, res) {
  const result = await getProjectIntelligence();
  res.json(result);
}
