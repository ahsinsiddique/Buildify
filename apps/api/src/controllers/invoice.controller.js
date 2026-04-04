import { invoiceService } from "../services/invoice.service.js";

export async function listInvoices(_req, res) {
  const rows = await invoiceService.listWithPayments();
  res.json(rows);
}

export async function getInvoice(req, res) {
  const row = await invoiceService.getById(req.params.id);
  res.json(row);
}

export async function createInvoice(req, res) {
  const row = await invoiceService.create(req.body);
  res.status(201).json(row);
}

export async function updateInvoice(req, res) {
  const row = await invoiceService.update(req.params.id, req.body);
  res.json(row);
}

export async function deleteInvoice(req, res) {
  await invoiceService.remove(req.params.id);
  res.status(204).send();
}
