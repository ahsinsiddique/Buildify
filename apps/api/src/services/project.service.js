import { db } from "../config/db.js";
import { HttpError } from "../lib/http-error.js";

import { createResourceService } from "./resource.service.js";

const baseService = createResourceService({
  table: "projects",
  createFields: [
    "name",
    "property_id",
    "start_date",
    "end_date",
    "budget",
    "status",
    "progress_percent"
  ],
  updateFields: [
    "name",
    "property_id",
    "start_date",
    "end_date",
    "budget",
    "status",
    "progress_percent"
  ]
});

export const projectService = {
  ...baseService,
  async create(payload) {
    if (payload.property_id !== null && payload.property_id !== undefined) {
      const propertyResult = await db.query(
        "SELECT id FROM properties WHERE id = $1",
        [payload.property_id]
      );

      if (!propertyResult.rows[0]) {
        throw new HttpError(400, "Selected property does not exist");
      }
    }

    return baseService.create(payload);
  },
  async update(id, payload) {
    if (payload.property_id !== null && payload.property_id !== undefined) {
      const propertyResult = await db.query(
        "SELECT id FROM properties WHERE id = $1",
        [payload.property_id]
      );

      if (!propertyResult.rows[0]) {
        throw new HttpError(400, "Selected property does not exist");
      }
    }

    return baseService.update(id, payload);
  },
  async getProjectSummary(id) {
    const projectResult = await db.query(
      `SELECT p.*,
              COALESCE(SUM(e.amount), 0) AS total_expenses
       FROM projects p
       LEFT JOIN expenses e ON e.project_id = p.id
       WHERE p.id = $1
       GROUP BY p.id`,
      [id]
    );

    const logResult = await db.query(
      `SELECT id, log_date, work_done, labor_count
       FROM project_logs
       WHERE project_id = $1
       ORDER BY log_date DESC
       LIMIT 10`,
      [id]
    );

    return {
      project: projectResult.rows[0],
      recentLogs: logResult.rows
    };
  }
};
