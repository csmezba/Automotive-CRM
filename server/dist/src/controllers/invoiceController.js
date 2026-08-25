"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInvoice = exports.updateInvoice = exports.createInvoice = exports.getInvoiceById = exports.getInvoices = void 0;
const Invoice_js_1 = __importDefault(require("../models/Invoice.js"));
const AuditLog_js_1 = __importDefault(require("../models/AuditLog.js"));
const getInvoices = async (req, res) => {
    try {
        const { status, customerId } = req.query;
        let query = {};
        if (status)
            query.status = status;
        if (customerId)
            query.customerId = customerId;
        const invoices = await Invoice_js_1.default.find(query).sort({ createdAt: -1 });
        res.json(invoices);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getInvoices = getInvoices;
const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice_js_1.default.findOne({ id: req.params.id });
        if (!invoice) {
            res.status(404).json({ error: "Invoice not found" });
            return;
        }
        res.json(invoice);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getInvoiceById = getInvoiceById;
const createInvoice = async (req, res) => {
    try {
        const body = req.body;
        const newInvoice = new Invoice_js_1.default({
            id: body.id || `INV-${Date.now().toString().substring(8)}`,
            bookingId: body.bookingId,
            customerId: body.customerId,
            customerName: body.customerName,
            customerEmail: body.customerEmail || "",
            customerPhone: body.customerPhone || "",
            vehicleId: body.vehicleId || "",
            vehicleName: body.vehicleName || "",
            licensePlate: body.licensePlate || "",
            items: body.items || [],
            subtotal: body.subtotal || 0,
            taxRate: body.taxRate || 0.15,
            tax: body.tax || 0,
            discountAmount: body.discountAmount || 0,
            discount: body.discount || 0,
            couponCode: body.couponCode || "",
            total: body.total || body.totalAmount || 0,
            totalAmount: body.totalAmount || body.total || 0,
            status: body.status || "Unpaid",
            paymentMethod: body.paymentMethod || "Credit Card",
            paymentDate: body.paymentDate || "",
            dueDate: body.dueDate || "",
            createdAt: new Date().toISOString(),
        });
        await newInvoice.save();
        await AuditLog_js_1.default.create({
            id: `AUD-${Date.now()}`,
            userId: "USR-2",
            userName: "Elena Rostova",
            role: "Manager",
            action: "Create Invoice",
            target: `Generated invoice ${newInvoice.id} for ${newInvoice.customerName}`,
        });
        res.status(201).json(newInvoice);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createInvoice = createInvoice;
const updateInvoice = async (req, res) => {
    try {
        const invoice = await Invoice_js_1.default.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (!invoice) {
            res.status(404).json({ error: "Invoice not found" });
            return;
        }
        await AuditLog_js_1.default.create({
            id: `AUD-${Date.now()}`,
            userId: "USR-2",
            userName: "Elena Rostova",
            role: "Manager",
            action: "Update Invoice",
            target: `Updated invoice ${invoice.id} status to ${invoice.status}`,
        });
        res.json(invoice);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateInvoice = updateInvoice;
const deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice_js_1.default.findOneAndDelete({ id: req.params.id });
        if (!invoice) {
            res.status(404).json({ error: "Invoice not found" });
            return;
        }
        res.json({ message: "Invoice deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteInvoice = deleteInvoice;
