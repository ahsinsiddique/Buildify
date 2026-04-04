import { createResourceService } from "./resource.service.js";

export const consultationService = createResourceService({
  table: "consultations",
  createFields: ["client_id", "property_id", "consult_date", "notes"],
  updateFields: ["client_id", "property_id", "consult_date", "notes"]
});
