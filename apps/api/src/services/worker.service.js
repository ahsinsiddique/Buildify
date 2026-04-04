import { db } from "../config/db.js";
import { createResourceService } from "./resource.service.js";

export const workerService = createResourceService({
  table: "workers",
  createFields: ["name", "role", "daily_wage", "phone"],
  updateFields: ["name", "role", "daily_wage", "phone"]
});

workerService.payWorker = async function(id, payload) {
  const { amount, projectId, paymentDate } = payload;
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    
    await client.query(`
      INSERT INTO expenses (project_id, worker_id, category, amount, description, expense_date)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [projectId, id, 'Labor', amount, `Worker Payment - API ID ${id}`, paymentDate]);

    const invoiceNumber = `W-PAY-${id}-${Date.now()}`;
    await client.query(`
      INSERT INTO invoices (invoice_number, project_id, total_amount, status, issued_date)
      VALUES ($1, $2, $3, $4, $5)
    `, [invoiceNumber, projectId, amount, "Paid", paymentDate]);

    await client.query('COMMIT');
    return { success: true, invoiceNumber };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
