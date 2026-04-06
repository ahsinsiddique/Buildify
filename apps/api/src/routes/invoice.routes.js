import { Router } from "express";

import {
  createInvoice,
  deleteInvoice,
  getInvoice,
  listInvoices,
  updateInvoice
} from "../controllers/invoice.controller.js";
import { invoiceService } from "../services/invoice.service.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const invoiceRoutes = Router();

invoiceRoutes.use(asyncHandler(requireAuth));
invoiceRoutes.get("/", asyncHandler(listInvoices));
invoiceRoutes.get("/:id/detail", asyncHandler(async (req, res) => {
  const result = await invoiceService.getDetail(req.params.id);
  res.json(result);
}));
invoiceRoutes.get("/:id", asyncHandler(getInvoice));
invoiceRoutes.post("/", asyncHandler(requireRole("admin", "accountant")), asyncHandler(createInvoice));
invoiceRoutes.patch("/:id", asyncHandler(requireRole("admin", "accountant")), asyncHandler(updateInvoice));
invoiceRoutes.delete("/:id", asyncHandler(requireRole("admin")), asyncHandler(deleteInvoice));
