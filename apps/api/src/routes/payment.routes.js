import { Router } from "express";

import {
  createPayment,
  deletePayment,
  getPayment,
  listPayments,
  updatePayment
} from "../controllers/payment.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const paymentRoutes = Router();

paymentRoutes.use(asyncHandler(requireAuth));
paymentRoutes.get("/", asyncHandler(listPayments));
paymentRoutes.get("/:id", asyncHandler(getPayment));
paymentRoutes.post("/", asyncHandler(requireRole("admin", "accountant")), asyncHandler(createPayment));
paymentRoutes.patch("/:id", asyncHandler(requireRole("admin", "accountant")), asyncHandler(updatePayment));
paymentRoutes.delete("/:id", asyncHandler(requireRole("admin")), asyncHandler(deletePayment));
