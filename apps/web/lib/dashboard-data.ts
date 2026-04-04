export const navigationItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/clients", label: "Clients" },
  { href: "/dashboard/properties", label: "Properties" },
  { href: "/dashboard/vendors", label: "Vendors" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/expenses", label: "Expenses" },
  { href: "/dashboard/workers", label: "Workers" },
  { href: "/dashboard/materials", label: "Materials" },
  { href: "/dashboard/invoices", label: "Invoices" }
];

export const statCards = [
  { title: "Total Projects", value: "12", accent: "text-clay" },
  { title: "Total Expenses", value: "PKR 2.5M", accent: "text-moss" },
  { title: "Active Workers", value: "45", accent: "text-ink" },
  { title: "Pending Invoices", value: "8", accent: "text-brass" }
];

export const expenseChartData = [
  { day: "Mon", amount: 20000 },
  { day: "Tue", amount: 30000 },
  { day: "Wed", amount: 25000 },
  { day: "Thu", amount: 42000 },
  { day: "Fri", amount: 28000 },
  { day: "Sat", amount: 19000 }
];

export const projects = [
  { id: 1, name: "Lake View Villas", budget: "PKR 12M", progress: "68%", status: "On track" },
  { id: 2, name: "Riverside Plaza", budget: "PKR 21M", progress: "41%", status: "Budget watch" },
  { id: 3, name: "Green Homes Block C", budget: "PKR 9M", progress: "83%", status: "Closing phase" },
  { id: 4, name: "Canal Residency", budget: "PKR 15M", progress: "29%", status: "Mobilization" }
];

export const workerRows = [
  { name: "Akram Ali", role: "Mason", project: "Lake View Villas", wage: "PKR 3,500/day" },
  { name: "Usman Tariq", role: "Electrician", project: "Riverside Plaza", wage: "PKR 4,200/day" },
  { name: "Bilal Khan", role: "Site Supervisor", project: "Green Homes Block C", wage: "PKR 6,500/day" }
];

export const materialRows = [
  { name: "Cement", stock: "420 bags", unitCost: "PKR 1,420", vendor: "PakBuild Supply" },
  { name: "Steel", stock: "18 tons", unitCost: "PKR 274,000", vendor: "Metro Steel" },
  { name: "Bricks", stock: "12,000 pcs", unitCost: "PKR 18", vendor: "City Kiln" }
];

export const invoiceRows = [
  { number: "INV-2026-101", client: "Hassan Builders", amount: "PKR 1.2M", status: "Partial" },
  { number: "INV-2026-102", client: "Ayesha Holdings", amount: "PKR 780K", status: "Pending" },
  { number: "INV-2026-103", client: "Prime Estates", amount: "PKR 2.1M", status: "Paid" }
];

export const expenseRows = [
  { category: "Materials", project: "Lake View Villas", amount: "PKR 420K", date: "2026-04-02" },
  { category: "Labor", project: "Riverside Plaza", amount: "PKR 190K", date: "2026-04-03" },
  { category: "Transport", project: "Canal Residency", amount: "PKR 52K", date: "2026-04-03" }
];
