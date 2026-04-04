import { expenseService } from "../services/expense.service.js";

export async function listExpenses(req, res) {
  const rows = await expenseService.list({ project_id: req.query.project_id });
  res.json(rows);
}

export async function getExpense(req, res) {
  const row = await expenseService.getById(req.params.id);
  res.json(row);
}

export async function createExpense(req, res) {
  const row = await expenseService.create(req.body);
  res.status(201).json(row);
}

export async function updateExpense(req, res) {
  const row = await expenseService.update(req.params.id, req.body);
  res.json(row);
}

export async function deleteExpense(req, res) {
  await expenseService.remove(req.params.id);
  res.status(204).send();
}
