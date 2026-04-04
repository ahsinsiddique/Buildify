import { propertyService } from "../services/property.service.js";

export async function listProperties(req, res) {
  const rows = await propertyService.list({ status: req.query.status });
  res.json(rows);
}

export async function getProperty(req, res) {
  const row = await propertyService.getById(req.params.id);
  res.json(row);
}

export async function createProperty(req, res) {
  const row = await propertyService.create(req.body);
  res.status(201).json(row);
}

export async function updateProperty(req, res) {
  const row = await propertyService.update(req.params.id, req.body);
  res.json(row);
}

export async function deleteProperty(req, res) {
  await propertyService.remove(req.params.id);
  res.status(204).send();
}
