/**
 * MONOLITH Subscription Store
 * Manages subscription plans, requests, and user entitlements.
 * Backed by localStorage — frontend-only MVP, ready to swap for an API.
 */

const REQUESTS_KEY    = "monolith-sub-requests";
const SUBS_KEY        = "monolith-subscriptions";

// ── Types ──────────────────────────────────────────────────────────────────

export type Plan = "free" | "pro" | "enterprise";
export type RequestStatus = "pending" | "approved" | "rejected";

export interface SubscriptionRequest {
  id: string;
  userId: number;
  userName: string;
  userEmail: string;
  userRole: string;
  plan: Plan;
  requestedAt: string;
  status: RequestStatus;
  processedAt?: string;
  processedBy?: string;
  note?: string;
}

export interface UserSubscription {
  userId: number;
  plan: Plan;
  activatedAt: string;
  expiresAt: string;
}

export interface PlanConfig {
  name: string;
  price: number;
  priceLabel: string;
  billingNote: string;
  features: string[];
  highlight?: boolean;
}

// ── Plan Catalogue ─────────────────────────────────────────────────────────

export const PLANS: Record<Plan, PlanConfig> = {
  free: {
    name: "Starter",
    price: 0,
    priceLabel: "Free",
    billingNote: "Forever free",
    features: [
      "Dashboard Overview",
      "Up to 5 Active Projects",
      "Up to 10 Workers",
      "Basic Expense Tracking",
      "Client & Vendor CRM",
    ],
  },
  pro: {
    name: "Pro",
    price: 4999,
    priceLabel: "PKR 4,999",
    billingNote: "per month",
    highlight: true,
    features: [
      "Everything in Starter",
      "Unlimited Projects & Workers",
      "AI Intelligence Hub",
      "Full Financial Dashboard",
      "Worker Management Suite",
      "Advanced Reporting & Exports",
      "Priority Email Support",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: 12999,
    priceLabel: "PKR 12,999",
    billingNote: "per month",
    features: [
      "Everything in Pro",
      "White-label Reports",
      "Multi-company Workspaces",
      "Custom Data Integrations",
      "Dedicated Account Manager",
      "99.9% SLA Uptime Guarantee",
    ],
  },
};

// ── Storage helpers ────────────────────────────────────────────────────────

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// ── Store API ──────────────────────────────────────────────────────────────

export const subscriptionStore = {
  // ── Requests ──────────────────────────────────────────────────────────

  getRequests(): SubscriptionRequest[] {
    return read<SubscriptionRequest[]>(REQUESTS_KEY, []);
  },

  getPendingRequests(): SubscriptionRequest[] {
    return this.getRequests().filter((r) => r.status === "pending");
  },

  getUserPendingRequest(userId: number): SubscriptionRequest | null {
    return (
      this.getRequests().find((r) => r.userId === userId && r.status === "pending") ?? null
    );
  },

  // ── Subscriptions ──────────────────────────────────────────────────────

  getAllSubscriptions(): UserSubscription[] {
    return read<UserSubscription[]>(SUBS_KEY, []);
  },

  getUserSubscription(userId: number): UserSubscription | null {
    return this.getAllSubscriptions().find((s) => s.userId === userId) ?? null;
  },

  getUserPlan(userId: number): Plan {
    return this.getUserSubscription(userId)?.plan ?? "free";
  },

  // ── Actions ───────────────────────────────────────────────────────────

  submitRequest(
    user: { id: number; name: string; email: string; role: string },
    plan: Plan
  ): SubscriptionRequest {
    // Cancel any existing pending request for this user
    const existing = this.getRequests().filter(
      (r) => !(r.userId === user.id && r.status === "pending")
    );

    const req: SubscriptionRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      plan,
      requestedAt: new Date().toISOString(),
      status: "pending",
    };

    write(REQUESTS_KEY, [...existing, req]);
    return req;
  },

  processRequest(
    requestId: string,
    action: "approved" | "rejected",
    adminName: string,
    note?: string
  ) {
    const requests = this.getRequests();
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    req.status = action;
    req.processedAt = new Date().toISOString();
    req.processedBy = adminName;
    if (note?.trim()) req.note = note.trim();
    write(REQUESTS_KEY, requests);

    if (action === "approved") {
      const now = new Date();
      const expires = new Date(now);
      expires.setMonth(expires.getMonth() + 1);

      const all = this.getAllSubscriptions();
      const idx = all.findIndex((s) => s.userId === req.userId);
      const sub: UserSubscription = {
        userId: req.userId,
        plan: req.plan,
        activatedAt: now.toISOString(),
        expiresAt: expires.toISOString(),
      };
      if (idx >= 0) all[idx] = sub;
      else all.push(sub);
      write(SUBS_KEY, all);
    }
  },

  // ── Demo data seed (runs once) ─────────────────────────────────────────

  seedDemoData() {
    const existing = this.getRequests();
    if (existing.length > 0) return; // already seeded

    const ago = (days: number) =>
      new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const demo: SubscriptionRequest[] = [
      {
        id: "req_demo_1",
        userId: 9001,
        userName: "Ahmed Hassan",
        userEmail: "ahmed@construx.pk",
        userRole: "manager",
        plan: "pro",
        requestedAt: ago(2),
        status: "pending",
      },
      {
        id: "req_demo_2",
        userId: 9002,
        userName: "Sara Khan",
        userEmail: "sara@infratech.pk",
        userRole: "accountant",
        plan: "enterprise",
        requestedAt: ago(1),
        status: "pending",
      },
      {
        id: "req_demo_3",
        userId: 9003,
        userName: "Bilal Malik",
        userEmail: "bilal@arcbuild.pk",
        userRole: "manager",
        plan: "pro",
        requestedAt: ago(12),
        status: "approved",
        processedAt: ago(11),
        processedBy: "Super Admin",
      },
      {
        id: "req_demo_4",
        userId: 9004,
        userName: "Fatima Rizvi",
        userEmail: "fatima@estategroup.pk",
        userRole: "manager",
        plan: "pro",
        requestedAt: ago(20),
        status: "rejected",
        processedAt: ago(19),
        processedBy: "Super Admin",
        note: "Invalid payment verification documents",
      },
      {
        id: "req_demo_5",
        userId: 9005,
        userName: "Usman Tariq",
        userEmail: "usman@buildco.pk",
        userRole: "admin",
        plan: "enterprise",
        requestedAt: ago(5),
        status: "approved",
        processedAt: ago(4),
        processedBy: "Super Admin",
      },
    ];

    write(REQUESTS_KEY, demo);

    // Seed active subscriptions for approved requests
    const now = new Date();
    const oneMonth = new Date(now);
    oneMonth.setMonth(oneMonth.getMonth() + 1);

    const subs: UserSubscription[] = [
      {
        userId: 9003,
        plan: "pro",
        activatedAt: ago(11),
        expiresAt: oneMonth.toISOString(),
      },
      {
        userId: 9005,
        plan: "enterprise",
        activatedAt: ago(4),
        expiresAt: oneMonth.toISOString(),
      },
    ];
    write(SUBS_KEY, subs);
  },
};
