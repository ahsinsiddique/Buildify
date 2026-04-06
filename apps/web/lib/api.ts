export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001";

type ApiOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  token?: string | null;
  body?: Record<string, unknown>;
};

async function parseError(response: Response) {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error ?? "Request failed";
  } catch {
    return "Request failed";
  }
}

export async function apiRequest<T>(path: string, options: ApiOptions = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token
        ? {
            Authorization: `Bearer ${options.token}`
          }
        : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

export type AuthPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = AuthPayload & {
  name: string;
  role: string;
};

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type AuthResponse = {
  token: string;
  user: SessionUser;
};

export type DashboardStats = {
  summary: {
    total_projects: string;
    total_properties: string;
    total_expenses: string;
    total_invoiced: string;
  };
  projectCosts: Array<{
    id: number;
    name: string;
    budget: string;
    spent: string;
  }>;
  spendingTrend: Array<{
    expense_date: string;
    total: string;
  }>;
};

export type IntelligenceProject = {
  id: number;
  name: string;
  status: string;
  budget: number;
  spent: number;
  progressPercent: number;
  projectedTotalCost: number;
  overrunPercent: number;
  overrunRisk: "low" | "medium" | "high";
  materialVariancePercent: number;
  projectedDelayDays: number;
  suggestions: string[];
  flags: string[];
};

export type ProjectIntelligence = {
  summary: {
    analyzedProjects: number;
    flaggedProjects: number;
    highRiskProjects: number;
  };
  projects: IntelligenceProject[];
};

export type WorkerIntelligence = {
  id: number;
  name: string;
  role: string;
  dailyWage: number;
  phone?: string;
  attendance: {
    present: number;
    half: number;
    absent: number;
  };
  earnedSalary: number;
  productivityScore: number;
  assignedProjects: Array<{ project_id: number; project_name: string; }>;
};

export type WorkerIntelligenceData = {
  summary: {
    totalWorkers: number;
    bestWorker: {
      id: number;
      name: string;
      score: number;
    } | null;
  };
  workers: WorkerIntelligence[];
};

export async function loginUser(payload: AuthPayload) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload
  });
}

export async function registerUser(payload: RegisterPayload) {
  await apiRequest<SessionUser>("/auth/register", {
    method: "POST",
    body: payload
  });

  return loginUser({
    email: payload.email,
    password: payload.password
  });
}

export async function fetchDashboardStats(token: string) {
  return apiRequest<DashboardStats>("/dashboard/stats", { token });
}

export async function fetchProjectIntelligence(token: string) {
  return apiRequest<ProjectIntelligence>("/dashboard/intelligence", { token });
}

export async function fetchWorkerIntelligence(token: string) {
  return apiRequest<WorkerIntelligenceData>("/workers/intelligence", { token });
}

export type Client = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
};

export type Project = {
  id: number;
  name: string;
  status: string;
};

export async function fetchClients(token: string) {
  return apiRequest<Client[]>("/clients", { token });
}

export async function fetchProjects(token: string) {
  return apiRequest<Project[]>("/projects", { token });
}

export type WorkerPayment = {
  expense_id: number;
  amount: number;
  description: string;
  expense_date: string;
  project_id: number | null;
  project_name: string | null;
  invoice_id: number | null;
  invoice_number: string | null;
  invoice_status: string | null;
  client_id: number | null;
  client_name: string | null;
};

export async function fetchWorkerPayments(workerId: number, token: string) {
  return apiRequest<WorkerPayment[]>(`/workers/${workerId}/payments`, { token });
}

export type InvoiceListItem = {
  id: number;
  invoice_number: string;
  client_id: number | null;
  client_name: string | null;
  project_id: number | null;
  project_name: string | null;
  total_amount: number;
  amount_paid: number;
  status: string;
  issued_date: string;
  due_date: string | null;
};

export type InvoiceExpense = {
  id: number;
  amount: number;
  description: string | null;
  expense_date: string;
  category: string;
  worker_id: number | null;
  worker_name: string | null;
  worker_role: string | null;
};

export type InvoiceDetail = {
  invoice: InvoiceListItem & {
    client_phone: string | null;
    client_email: string | null;
    project_status: string | null;
    project_budget: number | null;
    project_progress: number | null;
  };
  expenses: InvoiceExpense[];
};

export async function fetchInvoices(token: string) {
  return apiRequest<InvoiceListItem[]>("/invoices", { token });
}

export async function fetchInvoiceDetail(id: number, token: string) {
  return apiRequest<InvoiceDetail>(`/invoices/${id}/detail`, { token });
}

export async function payWorker(
  id: string | number,
  token: string,
  payload: {
    amount: number;
    projectId: number;
    paymentDate: string;
    clientId: number;
    invoiceDescription: string;
  }
) {
  return apiRequest(`/workers/${id}/pay`, {
    method: "POST",
    token,
    body: payload as unknown as Record<string, unknown>
  });
}

export async function listResource<T>(path: string, token: string) {
  return apiRequest<T[]>(path, { token });
}

export type SelectOption = {
  label: string;
  value: string;
};

export async function createResource<T>(
  path: string,
  token: string,
  body: Record<string, unknown>
) {
  return apiRequest<T>(path, {
    method: "POST",
    token,
    body
  });
}

export async function updateResource<T>(
  path: string,
  id: number | string,
  token: string,
  body: Record<string, unknown>
) {
  return apiRequest<T>(`${path}/${id}`, {
    method: "PATCH",
    token,
    body
  });
}

export async function deleteResource(path: string, id: number | string, token: string) {
  return apiRequest<null>(`${path}/${id}`, {
    method: "DELETE",
    token
  });
}
