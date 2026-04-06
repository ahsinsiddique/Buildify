export const resourcePages = {
  clients: {
    title: "Clients",
    eyebrow: "Client Relationships",
    description: "Manage your client relationships and contact directory. Link clients to invoices and projects for full billing traceability.",
    path: "/clients",
    fields: [
      { name: "name", label: "Client Name", required: true },
      { name: "phone", label: "Phone" },
      { name: "email", label: "Email" },
      { name: "notes", label: "Notes", type: "textarea" }
    ],
    columns: [
      { key: "name", label: "Name" },
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email" },
      { key: "notes", label: "Notes" }
    ]
  },
  properties: {
    title: "Properties",
    eyebrow: "Property Management",
    description: "Log and track every plot, unit, and property asset in your portfolio. Assign properties to projects and monitor status from available to sold.",
    path: "/properties",
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "location", label: "Location", required: true, type: "textarea" },
      { name: "size", label: "Size" },
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        options: [
          { label: "Available", value: "available" },
          { label: "Sold", value: "sold" },
          { label: "Under Construction", value: "under_construction" }
        ]
      },
      { name: "price", label: "Price", type: "number" }
    ],
    columns: [
      { key: "title", label: "Title" },
      { key: "location", label: "Location" },
      { key: "status", label: "Status" },
      { key: "price", label: "Price" }
    ]
  },
  vendors: {
    title: "Vendors",
    eyebrow: "Vendor Directory",
    description: "Maintain your supplier and contractor directory. Vendors feed directly into material purchases and expense records.",
    path: "/vendors",
    fields: [
      { name: "name", label: "Vendor Name", required: true },
      { name: "phone", label: "Phone" },
      { name: "email", label: "Email" },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: [
          { label: "Materials", value: "materials" },
          { label: "Transport", value: "transport" },
          { label: "Equipment", value: "equipment" },
          { label: "Contractor", value: "contractor" },
          { label: "Services", value: "services" },
          { label: "Other", value: "other" }
        ]
      },
      { name: "notes", label: "Notes", type: "textarea" }
    ],
    columns: [
      { key: "name", label: "Name" },
      { key: "category", label: "Category" },
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email" }
    ]
  },
  projects: {
    title: "Projects",
    eyebrow: "Project Management",
    description: "Create and manage construction projects from inception to handover. Set budgets, timelines, and track real-time progress against targets.",
    path: "/projects",
    fields: [
      { name: "name", label: "Name", required: true },
      {
        name: "property_id",
        label: "Property",
        type: "select",
        optionsPath: "/properties",
        optionLabelKey: "title",
        optionValueKey: "id"
      },
      { name: "start_date", label: "Start Date", type: "date" },
      { name: "end_date", label: "End Date", type: "date" },
      { name: "budget", label: "Budget", type: "number", required: true },
      { name: "status", label: "Status", required: true },
      { name: "progress_percent", label: "Progress %", type: "number" }
    ],
    columns: [
      { key: "name", label: "Name" },
      { key: "property_id", label: "Property ID" },
      { key: "status", label: "Status" },
      { key: "budget", label: "Budget" },
      { key: "progress_percent", label: "Progress %" }
    ]
  },
  expenses: {
    title: "Expenses",
    eyebrow: "Cost Tracking",
    description: "Log every cost against a project and category. Expenses feed directly into the financial dashboard and profitability calculations.",
    path: "/expenses",
    fields: [
      {
        name: "project_id",
        label: "Project",
        type: "select",
        optionsPath: "/projects",
        optionLabelKey: "name",
        optionValueKey: "id",
        excludeOptionStatuses: ["completed", "cancelled", "closed"]
      },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: [
          { label: "Materials", value: "materials" },
          { label: "Labor", value: "labor" },
          { label: "Transport", value: "transport" },
          { label: "Equipment", value: "equipment" },
          { label: "Contractor", value: "contractor" },
          { label: "Permits", value: "permits" },
          { label: "Utilities", value: "utilities" },
          { label: "Maintenance", value: "maintenance" },
          { label: "Site Office", value: "site_office" },
          { label: "Other", value: "other" }
        ]
      },
      { name: "amount", label: "Amount", type: "number", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "expense_date", label: "Expense Date", type: "date", required: true }
    ],
    columns: [
      { key: "project_id", label: "Project ID" },
      { key: "category", label: "Category" },
      { key: "amount", label: "Amount" },
      { key: "expense_date", label: "Date" }
    ]
  },
  workers: {
    title: "Workers",
    eyebrow: "Workforce",
    description: "Register your workforce, set daily wages, and assign workers to projects. Worker data links to attendance, salary computation, and payment records.",
    path: "/workers",
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "role", label: "Role", required: true },
      { name: "daily_wage", label: "Daily Wage", type: "number" },
      { name: "phone", label: "Phone" }
    ],
    columns: [
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
      { key: "daily_wage", label: "Daily Wage" },
      { key: "phone", label: "Phone" }
    ]
  },
  materials: {
    title: "Materials",
    eyebrow: "Inventory",
    description: "Track your material inventory by unit, price, and vendor. Keep stock levels current to avoid project delays.",
    path: "/materials",
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "unit", label: "Unit", required: true },
      { name: "price_per_unit", label: "Price Per Unit", type: "number" },
      {
        name: "vendor_name",
        label: "Vendor",
        type: "select",
        optionsPath: "/vendors",
        optionLabelKey: "name",
        optionValueKey: "name"
      },
      { name: "current_stock", label: "Current Stock", type: "number" }
    ],
    columns: [
      { key: "name", label: "Name" },
      { key: "unit", label: "Unit" },
      { key: "price_per_unit", label: "Price" },
      { key: "current_stock", label: "Stock" }
    ]
  },
  invoices: {
    title: "Invoices",
    eyebrow: "Billing",
    description: "Generate and manage client invoices linked to projects. Track payment status from unpaid to settled in real time.",
    path: "/invoices",
    fields: [
      { name: "invoice_number", label: "Invoice Number", required: true },
      {
        name: "client_id",
        label: "Client",
        type: "select",
        optionsPath: "/clients",
        optionLabelKey: "name",
        optionValueKey: "id"
      },
      {
        name: "project_id",
        label: "Project",
        type: "select",
        optionsPath: "/projects",
        optionLabelKey: "name",
        optionValueKey: "id"
      },
      { name: "total_amount", label: "Total Amount", type: "number", required: true },
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        options: [
          { label: "Unpaid", value: "unpaid" },
          { label: "Partial", value: "partial" },
          { label: "Paid", value: "paid" }
        ]
      },
      { name: "issued_date", label: "Issued Date", type: "date", required: true },
      { name: "due_date", label: "Due Date", type: "date" }
    ],
    columns: [
      { key: "invoice_number", label: "Invoice #" },
      { key: "client_id", label: "Client" },
      { key: "project_id", label: "Project" },
      { key: "total_amount", label: "Amount" },
      { key: "status", label: "Status" }
    ]
  }
} as const;
