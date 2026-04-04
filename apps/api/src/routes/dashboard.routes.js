import { Router } from "express";

import { getStats } from "../controllers/dashboard.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const dashboardRoutes = Router();

dashboardRoutes.use(asyncHandler(requireAuth));
dashboardRoutes.get("/stats", asyncHandler(getStats));
