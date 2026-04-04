import { createResourceService } from "./resource.service.js";

export const vendorService = createResourceService({
  table: "vendors",
  createFields: ["name", "phone", "email", "category", "notes"],
  updateFields: ["name", "phone", "email", "category", "notes"]
});
