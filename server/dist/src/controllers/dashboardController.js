"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const Customer_js_1 = __importDefault(require("../models/Customer.js"));
const Vehicle_js_1 = __importDefault(require("../models/Vehicle.js"));
const Booking_js_1 = __importDefault(require("../models/Booking.js"));
const Part_js_1 = __importDefault(require("../models/Part.js"));
const Warranty_js_1 = __importDefault(require("../models/Warranty.js"));
const Invoice_js_1 = __importDefault(require("../models/Invoice.js"));
const Mechanic_js_1 = __importDefault(require("../models/Mechanic.js"));
const getDashboardStats = async (req, res) => {
    try {
        const [customers, vehicles, bookings, parts, policies, invoices, mechanics] = await Promise.all([
            Customer_js_1.default.find().sort({ createdAt: -1 }),
            Vehicle_js_1.default.find().sort({ createdAt: -1 }),
            Booking_js_1.default.find().sort({ createdAt: -1 }),
            Part_js_1.default.find().sort({ createdAt: -1 }),
            Warranty_js_1.default.find().sort({ createdAt: -1 }),
            Invoice_js_1.default.find().sort({ createdAt: -1 }),
            Mechanic_js_1.default.find().sort({ createdAt: -1 }),
        ]);
        const vehiclesInService = vehicles.filter((v) => v.status === "In Service").length;
        const completedServices = bookings.filter((b) => b.status === "Completed").length;
        const paidInvoices = invoices.filter((i) => i.status === "Paid");
        const revenuePaid = paidInvoices.reduce((acc, i) => acc + (i.total || i.totalAmount || 0), 0);
        const stats = {
            todayBookingsCount: bookings.length,
            vehiclesInServiceCount: vehiclesInService,
            completedServicesCount: completedServices,
            revenuePaid: revenuePaid,
            monthlyRevenue: [
                { month: "Jan", revenue: 8400, bookings: 42 },
                { month: "Feb", revenue: 9900, bookings: 51 },
                { month: "Mar", revenue: 11200, bookings: 58 },
                { month: "Jul", revenue: revenuePaid || 12450, bookings: bookings.length },
            ],
            serviceTrend: [
                { type: "Oil Change", count: 48 },
                { type: "Brake Service", count: 32 },
                { type: "Full Service", count: 18 },
            ],
        };
        res.json({
            customers,
            vehicles,
            bookings,
            parts,
            policies,
            invoices,
            mechanics,
            stats,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getDashboardStats = getDashboardStats;
