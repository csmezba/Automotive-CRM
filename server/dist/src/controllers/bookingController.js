"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBooking = exports.updateBooking = exports.createBooking = exports.getBookingById = exports.getBookings = void 0;
const Booking_js_1 = __importDefault(require("../models/Booking.js"));
const AuditLog_js_1 = __importDefault(require("../models/AuditLog.js"));
const getBookings = async (req, res) => {
    try {
        const { status, mechanicId, customerId } = req.query;
        let query = {};
        if (status)
            query.status = status;
        if (mechanicId)
            query.mechanicId = mechanicId;
        if (customerId)
            query.customerId = customerId;
        const bookings = await Booking_js_1.default.find(query).sort({ createdAt: -1 });
        res.json(bookings);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getBookings = getBookings;
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking_js_1.default.findOne({ id: req.params.id });
        if (!booking) {
            res.status(404).json({ error: "Booking not found" });
            return;
        }
        res.json(booking);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getBookingById = getBookingById;
const createBooking = async (req, res) => {
    try {
        const body = req.body;
        const newBooking = new Booking_js_1.default({
            id: body.id || `BK-${Date.now().toString().substring(8)}`,
            customerId: body.customerId,
            customerName: body.customerName || "",
            customerPhone: body.customerPhone || "",
            vehicleId: body.vehicleId,
            vehicleName: body.vehicleName || "",
            licensePlate: body.licensePlate || "",
            mechanicId: body.mechanicId || "",
            mechanicName: body.mechanicName || "",
            serviceType: body.serviceType,
            bookingDate: body.bookingDate,
            bookingTime: body.bookingTime || "09:00",
            status: body.status || "Scheduled",
            estimatedCost: body.estimatedCost || 0,
            estimatedTimeHours: body.estimatedTimeHours || 1,
            pickupRequired: body.pickupRequired || false,
            dropRequired: body.dropRequired || false,
            customerNotes: body.customerNotes || "",
            mechanicNotes: body.mechanicNotes || "",
            checklist: body.checklist || [],
            beforeImages: body.beforeImages || [],
            afterImages: body.afterImages || [],
        });
        await newBooking.save();
        await AuditLog_js_1.default.create({
            id: `AUD-${Date.now()}`,
            userId: "USR-3",
            userName: "Kenji Sato",
            role: "Service Advisor",
            action: "Create Booking",
            target: `Created booking ${newBooking.id} for ${newBooking.customerName}`,
        });
        res.status(201).json(newBooking);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createBooking = createBooking;
const updateBooking = async (req, res) => {
    try {
        const booking = await Booking_js_1.default.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (!booking) {
            res.status(404).json({ error: "Booking not found" });
            return;
        }
        await AuditLog_js_1.default.create({
            id: `AUD-${Date.now()}`,
            userId: "USR-3",
            userName: "Kenji Sato",
            role: "Service Advisor",
            action: "Update Booking",
            target: `Updated booking ${booking.id}`,
        });
        res.json(booking);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateBooking = updateBooking;
const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking_js_1.default.findOneAndDelete({ id: req.params.id });
        if (!booking) {
            res.status(404).json({ error: "Booking not found" });
            return;
        }
        await AuditLog_js_1.default.create({
            id: `AUD-${Date.now()}`,
            userId: "USR-1",
            userName: "Marcus Vance",
            role: "Admin",
            action: "Delete Booking",
            target: `Deleted booking ${booking.id}`,
        });
        res.json({ message: "Booking deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteBooking = deleteBooking;
