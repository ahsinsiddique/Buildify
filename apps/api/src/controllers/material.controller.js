import { materialService } from "../services/material.service.js";

export async function listMaterials(_req, res) {
  const rows = await materialService.list();
  res.json(rows);
}

export async function getMaterial(req, res) {
  const row = await materialService.getById(req.params.id);
  res.json(row);
}

export async function createMaterial(req, res) {
  const row = await materialService.create(req.body);
  res.status(201).json(row);
}

export async function updateMaterial(req, res) {
  const row = await materialService.update(req.params.id, req.body);
  res.json(row);
}

export async function deleteMaterial(req, res) {
  await materialService.remove(req.params.id);
  res.status(204).send();
}
