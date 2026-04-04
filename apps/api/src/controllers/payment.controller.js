import { paymentService } from "../services/payment.service.js";

export async function listPayments(req, res) {
  const rows = await paymentService.list({ invoice_id: req.query.invoice_id });
  res.json(rows);
}

export async function getPayment(req, res) {
  const row = await paymentService.getById(req.params.id);
  res.json(row);
}

export async function createPayment(req, res) {
  const row = await paymentService.create(req.body);
  res.status(201).json(row);
}

export async function updatePayment(req, res) {
  const row = await paymentService.update(req.params.id, req.body);
  res.json(row);
}

export async function deletePayment(req, res) {
  await paymentService.remove(req.params.id);
  res.status(204).send();
}
