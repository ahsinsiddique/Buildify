import { db } from "../config/db.js";
import { HttpError } from "../lib/http-error.js";

import { createResourceService } from "./resource.service.js";

const baseService = createResourceService({
  table: "invoices",
  createFields: [
    "invoice_number",
    "client_id",
    "project_id",
    "total_amount",
    "status",
    "issued_date",
    "due_date"
  ],
  updateFields: [
    "client_id",
    "project_id",
    "total_amount",
    "status",
    "issued_date",
    "due_date"
  ]
});

export const invoiceService = {
  ...baseService,
  async create(payload) {
    if (payload.client_id !== null && payload.client_id !== undefined) {
      const clientResult = await db.query("SELECT id FROM clients WHERE id = $1", [
        payload.client_id
      ]);

      if (!clientResult.rows[0]) {
        throw new HttpError(400, "Selected client does not exist");
      }
    }

    if (payload.project_id !== null && payload.project_id !== undefined) {
      const projectResult = await db.query("SELECT id FROM projects WHERE id = $1", [
        payload.project_id
      ]);

      if (!projectResult.rows[0]) {
        throw new HttpError(400, "Selected project does not exist");
      }
    }

    return baseService.create(payload);
  },
  async update(id, payload) {
    if (payload.client_id !== null && payload.client_id !== undefined) {
      const clientResult = await db.query("SELECT id FROM clients WHERE id = $1", [
        payload.client_id
      ]);

      if (!clientResult.rows[0]) {
        throw new HttpError(400, "Selected client does not exist");
      }
    }

    if (payload.project_id !== null && payload.project_id !== undefined) {
      const projectResult = await db.query("SELECT id FROM projects WHERE id = $1", [
        payload.project_id
      ]);

      if (!projectResult.rows[0]) {
        throw new HttpError(400, "Selected project does not exist");
      }
    }

    return baseService.update(id, payload);
  },
  async listWithPayments() {
    const result = await db.query(
      `SELECT i.*,
              COALESCE(SUM(pay.amount), 0) AS amount_paid,
              c.name  AS client_name,
              pr.name AS project_name
       FROM invoices i
       LEFT JOIN payments pay ON pay.invoice_id = i.id
       LEFT JOIN clients  c   ON c.id  = i.client_id
       LEFT JOIN projects pr  ON pr.id = i.project_id
       GROUP BY i.id, c.name, pr.name
       ORDER BY i.issued_date DESC`
    );
    return result.rows;
  },

  async getDetail(id) {
    const invoiceResult = await db.query(
      `SELECT i.*,
              COALESCE(SUM(pay.amount), 0) AS amount_paid,
              c.name  AS client_name,
              c.phone AS client_phone,
              c.email AS client_email,
              pr.name AS project_name,
              pr.status AS project_status,
              pr.budget AS project_budget,
              pr.progress_percent AS project_progress
       FROM invoices i
       LEFT JOIN payments pay ON pay.invoice_id = i.id
       LEFT JOIN clients  c   ON c.id  = i.client_id
       LEFT JOIN projects pr  ON pr.id = i.project_id
       WHERE i.id = $1
       GROUP BY i.id, c.name, c.phone, c.email,
                pr.name, pr.status, pr.budget, pr.progress_percent`,
      [id]
    );

    const invoice = invoiceResult.rows[0];
    if (!invoice) throw new HttpError(404, "Invoice not found");

    // Related labour expenses for the same project
    const expensesResult = await db.query(
      `SELECT e.id,
              e.amount,
              e.description,
              e.expense_date,
              e.category,
              w.id   AS worker_id,
              w.name AS worker_name,
              w.role AS worker_role
       FROM expenses e
       LEFT JOIN workers w ON w.id = e.worker_id
       WHERE e.project_id = $1
       ORDER BY e.expense_date DESC`,
      [invoice.project_id ?? -1]
    );

    return { invoice, expenses: expensesResult.rows };
  }
};
