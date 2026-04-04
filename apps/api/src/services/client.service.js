import { createResourceService } from "./resource.service.js";

export const clientService = createResourceService({
  table: "clients",
  createFields: ["name", "phone", "email", "notes"],
  updateFields: ["name", "phone", "email", "notes"]
});
