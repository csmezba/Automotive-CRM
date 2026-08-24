"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const customerRoutes_js_1 = __importDefault(require("./routes/customerRoutes.js"));
const vehicleRoutes_js_1 = __importDefault(require("./routes/vehicleRoutes.js"));
const bookingRoutes_js_1 = __importDefault(require("./routes/bookingRoutes.js"));
const partRoutes_js_1 = __importDefault(require("./routes/partRoutes.js"));
const mechanicRoutes_js_1 = __importDefault(require("./routes/mechanicRoutes.js"));
const warrantyRoutes_js_1 = __importDefault(require("./routes/warrantyRoutes.js"));
const invoiceRoutes_js_1 = __importDefault(require("./routes/invoiceRoutes.js"));
const reminderRoutes_js_1 = __importDefault(require("./routes/reminderRoutes.js"));
const notificationRoutes_js_1 = __importDefault(require("./routes/notificationRoutes.js"));
const branchRoutes_js_1 = __importDefault(require("./routes/branchRoutes.js"));
const settingsRoutes_js_1 = __importDefault(require("./routes/settingsRoutes.js"));
const auditRoutes_js_1 = __importDefault(require("./routes/auditRoutes.js"));
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const dashboardRoutes_js_1 = __importDefault(require("./routes/dashboardRoutes.js"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
// Health Check
app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});
// API Routes
app.use("/api/auth", authRoutes_js_1.default);
app.use("/api/customers", customerRoutes_js_1.default);
app.use("/api/vehicles", vehicleRoutes_js_1.default);
app.use("/api/bookings", bookingRoutes_js_1.default);
app.use("/api/parts", partRoutes_js_1.default);
app.use("/api/mechanics", mechanicRoutes_js_1.default);
app.use("/api/warranties", warrantyRoutes_js_1.default);
app.use("/api/invoices", invoiceRoutes_js_1.default);
app.use("/api/reminders", reminderRoutes_js_1.default);
app.use("/api/notifications", notificationRoutes_js_1.default);
app.use("/api/branches", branchRoutes_js_1.default);
app.use("/api/settings", settingsRoutes_js_1.default);
app.use("/api/audit-logs", auditRoutes_js_1.default);
app.use("/api/dashboard", dashboardRoutes_js_1.default);
// Fallback 404 handler
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});
exports.default = app;
