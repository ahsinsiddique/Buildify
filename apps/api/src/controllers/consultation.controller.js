import { consultationService } from "../services/consultation.service.js";

export async function listConsultations(req, res) {
  const rows = await consultationService.list({ client_id: req.query.client_id });
  res.json(rows);
}

export async function getConsultation(req, res) {
  const row = await consultationService.getById(req.params.id);
  res.json(row);
}

export async function createConsultation(req, res) {
  const row = await consultationService.create(req.body);
  res.status(201).json(row);
}

export async function updateConsultation(req, res) {
  const row = await consultationService.update(req.params.id, req.body);
  res.json(row);
}

export async function deleteConsultation(req, res) {
  await consultationService.remove(req.params.id);
  res.status(204).send();
}
