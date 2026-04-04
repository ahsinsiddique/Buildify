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
              COALESCE(SUM(p.amount), 0) AS amount_paid
       FROM invoices i
       LEFT JOIN payments p ON p.invoice_id = i.id
       GROUP BY i.id
       ORDER BY i.created_at DESC`
    );

    return result.rows;
  }
};
