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

export const workerRoutes = Router();

workerRoutes.use(asyncHandler(requireAuth));
workerRoutes.get("/", asyncHandler(listWorkers));
workerRoutes.get("/:id", asyncHandler(getWorker));
workerRoutes.post("/", asyncHandler(requireRole("admin", "manager")), asyncHandler(createWorker));
workerRoutes.patch("/:id", asyncHandler(requireRole("admin", "manager")), asyncHandler(updateWorker));
workerRoutes.delete("/:id", asyncHandler(requireRole("admin")), asyncHandler(deleteWorker));
