import { createResourceService } from "./resource.service.js";

export const propertyService = createResourceService({
  table: "properties",
  createFields: ["title", "location", "size", "status", "price", "buyer_client_id"],
  updateFields: ["title", "location", "size", "status", "price", "buyer_client_id"]
});
