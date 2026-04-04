import { createResourceService } from "./resource.service.js";

export const paymentService = createResourceService({
  table: "payments",
  createFields: ["invoice_id", "amount", "payment_date", "method"],
  updateFields: ["invoice_id", "amount", "payment_date", "method"]
});
