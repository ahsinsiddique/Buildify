import { db } from "../config/db.js";
import { HttpError } from "../lib/http-error.js";

export function createResourceService({
  table,
  selectColumns = "*",
  sortableField = "created_at",
  createFields = [],
  updateFields = []
}) {
  return {
    async list(filters = {}) {
      const conditions = [];
      const values = [];

      Object.entries(filters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          return;
        }

        values.push(value);
        conditions.push(`${key} = $${values.length}`);
      });

      const whereClause = conditions.length
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

      const query = `SELECT ${selectColumns} FROM ${table} ${whereClause} ORDER BY ${sortableField} DESC`;
      const result = await db.query(query, values);
      return result.rows;
    },

    async getById(id) {
      const result = await db.query(
        `SELECT ${selectColumns} FROM ${table} WHERE id = $1`,
        [id]
      );

      const record = result.rows[0];

      if (!record) {
        throw new HttpError(404, `${table} record not found`);
      }

      return record;
    },

    async create(payload) {
      const columns = createFields.join(", ");
      const placeholders = createFields
        .map((_, index) => `$${index + 1}`)
        .join(", ");
      const values = createFields.map((field) => payload[field] ?? null);

      const result = await db.query(
        `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING ${selectColumns}`,
        values
      );

      return result.rows[0];
    },

    async update(id, payload) {
      const assignments = [];
      const values = [];

      updateFields.forEach((field) => {
        if (payload[field] === undefined) {
          return;
        }

        values.push(payload[field]);
        assignments.push(`${field} = $${values.length}`);
      });

      if (!assignments.length) {
        throw new HttpError(400, "No valid fields supplied for update");
      }

      values.push(id);

      const result = await db.query(
        `UPDATE ${table}
         SET ${assignments.join(", ")}
         WHERE id = $${values.length}
         RETURNING ${selectColumns}`,
        values
      );

      const record = result.rows[0];

      if (!record) {
        throw new HttpError(404, `${table} record not found`);
      }

      return record;
    },

    async remove(id) {
      const result = await db.query(
        `DELETE FROM ${table} WHERE id = $1 RETURNING ${selectColumns}`,
        [id]
      );

      const record = result.rows[0];

      if (!record) {
        throw new HttpError(404, `${table} record not found`);
      }

      return record;
    }
  };
}
