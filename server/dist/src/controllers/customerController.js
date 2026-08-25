"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomer = exports.updateCustomer = exports.createCustomer = exports.getCustomerById = exports.getCustomers = void 0;
const Customer_js_1 = __importDefault(require("../models/Customer.js"));
const AuditLog_js_1 = __importDefault(require("../models/AuditLog.js"));
const getCustomers = async (req, res) => {
    try {
        const { search, group, status } = req.query;
        let query = {};
        if (search) {
            const q = String(search);
            query.$or = [
                { name: { $regex: q, $options: "i" } },
                { email: { $regex: q, $options: "i" } },
                { phone: { $regex: q, $options: "i" } },
            ];
        }
        if (group)
            query.group = group;
        if (status)
            query.status = status;
        const customers = await Customer_js_1.default.find(query).sort({ createdAt: -1 });
        res.json(customers);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getCustomers = getCustomers;
const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer_js_1.default.findOne({ id: req.params.id });
        if (!customer) {
            res.status(404).json({ error: "Customer not found" });
            return;
        }
        res.json(customer);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getCustomerById = getCustomerById;
const createCustomer = async (req, res) => {
    try {
        const body = req.body;
        const newCust = new Customer_js_1.default({
            id: body.id || `CUST-${Date.now()}`,
            name: body.name,
            email: body.email || "",
            phone: body.phone || "",
            status: body.status || "Active",
            loyaltyPoints: body.loyaltyPoints || 0,
            tags: body.tags || [],
            group: body.group || "Retail",
            notes: body.notes || [],
            documents: body.documents || [],
            createdAt: new Date().toISOString(),
        });
        await newCust.save();
        await AuditLog_js_1.default.create({
            id: `AUD-${Date.now()}`,
            userId: "USR-1",
            userName: "Marcus Vance",
            role: "Admin",
            action: "Create Customer",
            target: `Created customer ${newCust.name}`,
        });
        res.status(201).json(newCust);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createCustomer = createCustomer;
const updateCustomer = async (req, res) => {
    try {
        const customer = await Customer_js_1.default.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (!customer) {
            res.status(404).json({ error: "Customer not found" });
            return;
        }
        await AuditLog_js_1.default.create({
            id: `AUD-${Date.now()}`,
            userId: "USR-1",
            userName: "Marcus Vance",
            role: "Admin",
            action: "Update Customer",
            target: `Updated customer ${customer.name}`,
        });
        res.json(customer);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateCustomer = updateCustomer;
const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer_js_1.default.findOneAndDelete({ id: req.params.id });
        if (!customer) {
            res.status(404).json({ error: "Customer not found" });
            return;
        }
        await AuditLog_js_1.default.create({
            id: `AUD-${Date.now()}`,
            userId: "USR-1",
            userName: "Marcus Vance",
            role: "Admin",
            action: "Delete Customer",
            target: `Deleted customer ${customer.name}`,
        });
        res.json({ message: "Customer deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteCustomer = deleteCustomer;
