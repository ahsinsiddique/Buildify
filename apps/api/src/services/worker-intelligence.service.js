import { db } from "../config/db.js";

function toNumber(value) {
  return Number(value ?? 0);
}

function round(value) {
  return Math.round(value * 100) / 100;
}

export async function getWorkerIntelligence() {
  // We compute workers' attendance, auto-salary, productivity, and project assignments

  const result = await db.query(`
    SELECT
      w.id,
      w.name,
      w.role,
      w.daily_wage,
      w.phone,
      COALESCE(
        (SELECT json_agg(json_build_object('project_id', pw.project_id, 'project_name', p.name))
         FROM project_workers pw
         JOIN projects p ON pw.project_id = p.id
         WHERE pw.worker_id = w.id),
        '[]'
      ) as assigned_projects,
      (
        SELECT count(*) 
        FROM worker_attendance wa 
        WHERE wa.worker_id = w.id AND wa.status = 'Present'
      ) as days_present,
      (
        SELECT count(*) 
        FROM worker_attendance wa 
        WHERE wa.worker_id = w.id AND wa.status = 'Half-Day'
      ) as days_half,
      (
        SELECT count(*) 
        FROM worker_attendance wa 
        WHERE wa.worker_id = w.id AND wa.status = 'Absent'
      ) as days_absent,
      (
        SELECT COALESCE(SUM(amount), 0)
        FROM expenses e
        WHERE e.worker_id = w.id
      ) as total_paid
    FROM workers w
    ORDER BY w.name ASC
  `);

  const workers = result.rows.map((row) => {
    const dailyWage = toNumber(row.daily_wage);
    const present = toNumber(row.days_present);
    const half = toNumber(row.days_half);
    const absent = toNumber(row.days_absent);
    const totalAttendanceDays = present + half + absent;
    
    // Auto Salary: (Present * daily) + (Half * (daily/2))
    const earnedSalary = (present * dailyWage) + (half * (dailyWage / 2));
    const totalPaid = toNumber(row.total_paid);
    const pendingBalance = Math.max(0, earnedSalary - totalPaid);
    
    // Productivity Score heuristic
    let productivityScore = 0;
    if (totalAttendanceDays === 0) {
      productivityScore = 0; // Not enough data
    } else {
      const attendanceRate = ((present + (half * 0.5)) / totalAttendanceDays) * 100;
      // Add small bonus for being assigned to multiple projects (up to 10 points)
      const projectBonus = Math.min(row.assigned_projects.length * 5, 10);
      productivityScore = round(Math.min(attendanceRate + projectBonus, 100));
    }

    return {
      id: row.id,
      name: row.name,
      role: row.role,
      dailyWage,
      phone: row.phone,
      attendance: { present, half, absent },
      earnedSalary,
      totalPaid,
      pendingBalance,
      productivityScore,
      assignedProjects: row.assigned_projects
    };
  });

  // Calculate best performing worker based on highest productivity score
  let bestWorker = null;
  if (workers.length > 0) {
    bestWorker = workers.reduce((prev, current) => {
      return (prev.productivityScore > current.productivityScore) ? prev : current;
    });
  }

  return {
    summary: {
      totalWorkers: workers.length,
      bestWorker: bestWorker ? {
        id: bestWorker.id,
        name: bestWorker.name,
        score: bestWorker.productivityScore
      } : null
    },
    workers
  };
}
