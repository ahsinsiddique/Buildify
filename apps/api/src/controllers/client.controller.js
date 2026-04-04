import { clientService } from "../services/client.service.js";

export async function listClients(_req, res) {
  const rows = await clientService.list();
  res.json(rows);
}

export async function getClient(req, res) {
  const row = await clientService.getById(req.params.id);
  res.json(row);
}

export async function createClient(req, res) {
  const row = await clientService.create(req.body);
  res.status(201).json(row);
}

export async function updateClient(req, res) {
  const row = await clientService.update(req.params.id, req.body);
  res.json(row);
}

export async function deleteClient(req, res) {
  await clientService.remove(req.params.id);
  res.status(204).send();
}
