import { db } from "../config/db.js";
import { createResourceService } from "./resource.service.js";

export const workerService = createResourceService({
  table: "workers",
  createFields: ["name", "role", "daily_wage", "phone"],
  updateFields: ["name", "role", "daily_wage", "phone"]
});

workerService.payWorker = async function(id, payload) {
  const { amount, projectId, paymentDate, clientId, invoiceDescription } = payload;
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const expenseDesc = invoiceDescription || `Worker Payment - ID ${id}`;
    await client.query(`
      INSERT INTO expenses (project_id, worker_id, category, amount, description, expense_date)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [projectId, id, 'Labor', amount, expenseDesc, paymentDate]);

    const invoiceNumber = `W-PAY-${id}-${Date.now()}`;
    await client.query(`
      INSERT INTO invoices (invoice_number, client_id, project_id, total_amount, status, issued_date)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [invoiceNumber, clientId || null, projectId, amount, "Paid", paymentDate]);

    await client.query('COMMIT');
    return { success: true, invoiceNumber };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
