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
workerRoutes.post("/:id/pay", asyncHandler(requireRole("admin", "manager")), asyncHandler(async (req, res) => {
  const result = await workerService.payWorker(req.params.id, req.body);
  res.json(result);
}));

workerRoutes.delete("/:id", asyncHandler(requireRole("admin")), asyncHandler(deleteWorker));
