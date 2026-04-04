import { vendorService } from "../services/vendor.service.js";

export async function listVendors(_req, res) {
  const rows = await vendorService.list();
  res.json(rows);
}

export async function getVendor(req, res) {
  const row = await vendorService.getById(req.params.id);
  res.json(row);
}

export async function createVendor(req, res) {
  const row = await vendorService.create(req.body);
  res.status(201).json(row);
}

export async function updateVendor(req, res) {
  const row = await vendorService.update(req.params.id, req.body);
  res.json(row);
}

export async function deleteVendor(req, res) {
  await vendorService.remove(req.params.id);
  res.status(204).send();
}
