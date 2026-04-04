import cors from "cors";
import express from "express";

import { errorHandler } from "./middleware/error-handler.js";
import { authRoutes } from "./routes/auth.routes.js";
import { clientRoutes } from "./routes/client.routes.js";
import { consultationRoutes } from "./routes/consultation.routes.js";
import { dashboardRoutes } from "./routes/dashboard.routes.js";
import { expenseRoutes } from "./routes/expense.routes.js";
import { invoiceRoutes } from "./routes/invoice.routes.js";
import { materialRoutes } from "./routes/material.routes.js";
import { paymentRoutes } from "./routes/payment.routes.js";
import { projectRoutes } from "./routes/project.routes.js";
import { propertyRoutes } from "./routes/property.routes.js";
import { vendorRoutes } from "./routes/vendor.routes.js";
import { workerRoutes } from "./routes/worker.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "property-app-api" });
});

app.use("/auth", authRoutes);
app.use("/properties", propertyRoutes);
app.use("/projects", projectRoutes);
app.use("/workers", workerRoutes);
app.use("/materials", materialRoutes);
app.use("/vendors", vendorRoutes);
app.use("/expenses", expenseRoutes);
app.use("/invoices", invoiceRoutes);
app.use("/payments", paymentRoutes);
app.use("/clients", clientRoutes);
app.use("/consultations", consultationRoutes);
app.use("/dashboard", dashboardRoutes);

app.use(errorHandler);
