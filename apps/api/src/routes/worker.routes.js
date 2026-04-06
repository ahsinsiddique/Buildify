import { Router } from "express";

import {
  createWorker,
  deleteWorker,
  getWorker,
  listWorkers,
  updateWorker
} from "../controllers/worker.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";
import { db } from "../config/db.js";
import { getWorkerIntelligence } from "../services/worker-intelligence.service.js";
import { workerService } from "../services/worker.service.js";

export const workerRoutes = Router();

workerRoutes.use(asyncHandler(requireAuth));

workerRoutes.get("/intelligence", asyncHandler(async (req, res) => {
  const result = await getWorkerIntelligence();
  res.json(result);
}));

workerRoutes.get("/", asyncHandler(listWorkers));
workerRoutes.get("/:id", asyncHandler(getWorker));
workerRoutes.post("/", asyncHandler(requireRole("admin", "manager")), asyncHandler(createWorker));
workerRoutes.patch("/:id", asyncHandler(requireRole("admin", "manager")), asyncHandler(updateWorker));
workerRoutes.get("/:id/payments", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await db.query(`
    SELECT
      e.id            AS expense_id,
      e.amount,
      e.description,
      e.expense_date,
      p.id            AS project_id,
      p.name          AS project_name,
      i.id            AS invoice_id,
      i.invoice_number,
      i.status        AS invoice_status,
      c.id            AS client_id,
      c.name          AS client_name
    FROM expenses e
    LEFT JOIN projects  p ON p.id = e.project_id
    LEFT JOIN invoices  i ON i.invoice_number LIKE $2
                         AND i.project_id = e.project_id
                         AND i.issued_date = e.expense_date
    LEFT JOIN clients   c ON c.id = i.client_id
    WHERE e.worker_id = $1
      AND e.category  = 'Labor'
    ORDER BY e.expense_date DESC
  `, [id, `W-PAY-${id}-%`]);
  res.json(result.rows);
}));

workerRoutes.post("/:id/pay", asyncHandler(requireRole("admin", "manager")), asyncHandler(async (req, res) => {
  const result = await workerService.payWorker(req.params.id, req.body);
  res.json(result);
}));

workerRoutes.delete("/:id", asyncHandler(requireRole("admin")), asyncHandler(deleteWorker));
