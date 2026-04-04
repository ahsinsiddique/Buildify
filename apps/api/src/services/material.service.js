import { createResourceService } from "./resource.service.js";

export const materialService = createResourceService({
  table: "materials",
  createFields: ["name", "unit", "price_per_unit", "vendor_name", "current_stock"],
  updateFields: ["name", "unit", "price_per_unit", "vendor_name", "current_stock"]
});
