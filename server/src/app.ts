import express, { Express, Request, Response } from "express";
import cors from "cors";
import customerRoutes from "./routes/customerRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import partRoutes from "./routes/partRoutes.js";
import mechanicRoutes from "./routes/mechanicRoutes.js";
import warrantyRoutes from "./routes/warrantyRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import branchRoutes from "./routes/branchRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app: Express = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/parts", partRoutes);
app.use("/api/mechanics", mechanicRoutes);
app.use("/api/warranties", warrantyRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Fallback 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

export default app;
