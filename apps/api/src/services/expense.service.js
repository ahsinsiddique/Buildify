import { createResourceService } from "./resource.service.js";

export const expenseService = createResourceService({
  table: "expenses",
  createFields: [
    "project_id",
    "category",
    "amount",
    "description",
    "expense_date",
    "receipt_url"
  ],
  updateFields: [
    "project_id",
    "category",
    "amount",
    "description",
    "expense_date",
    "receipt_url"
  ]
});
