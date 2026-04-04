import { Router } from "express";

import {
  createExpense,
  deleteExpense,
  getExpense,
  listExpenses,
  updateExpense
} from "../controllers/expense.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const expenseRoutes = Router();

expenseRoutes.use(asyncHandler(requireAuth));
expenseRoutes.get("/", asyncHandler(listExpenses));
expenseRoutes.get("/:id", asyncHandler(getExpense));
expenseRoutes.post("/", asyncHandler(requireRole("admin", "manager", "accountant")), asyncHandler(createExpense));
expenseRoutes.patch("/:id", asyncHandler(requireRole("admin", "manager", "accountant")), asyncHandler(updateExpense));
expenseRoutes.delete("/:id", asyncHandler(requireRole("admin")), asyncHandler(deleteExpense));
