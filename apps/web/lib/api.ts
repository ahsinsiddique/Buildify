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
