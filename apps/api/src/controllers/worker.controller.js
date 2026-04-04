import { workerService } from "../services/worker.service.js";

export async function listWorkers(_req, res) {
  const rows = await workerService.list();
  res.json(rows);
}

export async function getWorker(req, res) {
  const row = await workerService.getById(req.params.id);
  res.json(row);
}

export async function createWorker(req, res) {
  const row = await workerService.create(req.body);
  res.status(201).json(row);
}

export async function updateWorker(req, res) {
  const row = await workerService.update(req.params.id, req.body);
  res.json(row);
}

export async function deleteWorker(req, res) {
  await workerService.remove(req.params.id);
  res.status(204).send();
}
