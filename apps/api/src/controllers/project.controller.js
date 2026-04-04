import { projectService } from "../services/project.service.js";

export async function listProjects(req, res) {
  const rows = await projectService.list({ status: req.query.status });
  res.json(rows);
}

export async function getProject(req, res) {
  const summary = await projectService.getProjectSummary(req.params.id);
  res.json(summary);
}

export async function createProject(req, res) {
  const row = await projectService.create(req.body);
  res.status(201).json(row);
}

export async function updateProject(req, res) {
  const row = await projectService.update(req.params.id, req.body);
  res.json(row);
}

export async function deleteProject(req, res) {
  await projectService.remove(req.params.id);
  res.status(204).send();
}
