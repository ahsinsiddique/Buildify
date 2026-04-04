import { createResourceService } from "./resource.service.js";

export const workerService = createResourceService({
  table: "workers",
  createFields: ["name", "role", "daily_wage", "phone"],
  updateFields: ["name", "role", "daily_wage", "phone"]
});
