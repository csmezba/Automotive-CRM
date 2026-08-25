"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePart = exports.updatePart = exports.createPart = exports.getPartById = exports.getParts = void 0;
const Part_js_1 = __importDefault(require("../models/Part.js"));
const AuditLog_js_1 = __importDefault(require("../models/AuditLog.js"));
const getParts = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};
        if (category)
            query.category = category;
        if (search) {
            const q = String(search);
            query.$or = [
                { name: { $regex: q, $options: "i" } },
                { sku: { $regex: q, $options: "i" } },
                { supplier: { $regex: q, $options: "i" } },
            ];
        }
        const parts = await Part_js_1.default.find(query).sort({ createdAt: -1 });
        res.json(parts);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getParts = getParts;
const getPartById = async (req, res) => {
    try {
        const part = await Part_js_1.default.findOne({ id: req.params.id });
        if (!part) {
            res.status(404).json({ error: "Part not found" });
            return;
        }
        res.json(part);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getPartById = getPartById;
const createPart = async (req, res) => {
    try {
        const body = req.body;
        const newPart = new Part_js_1.default({
            id: body.id || `PART-${Date.now().toString().substring(10)}`,
            name: body.name,
            sku: body.sku,
            category: body.category || "General",
            stock: body.stock || 0,
            minStock: body.minStock || 5,
            purchasePrice: body.purchasePrice || 0,
            sellingPrice: body.sellingPrice || 0,
            supplier: body.supplier || "",
            warehouseLocation: body.warehouseLocation || "",
            compatibleVehicles: body.compatibleVehicles || [],
        });
        await newPart.save();
        await AuditLog_js_1.default.create({
            id: `AUD-${Date.now()}`,
            userId: "USR-2",
            userName: "Elena Rostova",
            role: "Manager",
            action: "Create Part",
            target: `Created spare part ${newPart.name} (${newPart.sku})`,
        });
        res.status(201).json(newPart);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createPart = createPart;
const updatePart = async (req, res) => {
    try {
        const part = await Part_js_1.default.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (!part) {
            res.status(404).json({ error: "Part not found" });
            return;
        }
        await AuditLog_js_1.default.create({
            id: `AUD-${Date.now()}`,
            userId: "USR-2",
            userName: "Elena Rostova",
            role: "Manager",
            action: "Update Part Inventory",
            target: `Updated part ${part.name}`,
        });
        res.json(part);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updatePart = updatePart;
const deletePart = async (req, res) => {
    try {
        const part = await Part_js_1.default.findOneAndDelete({ id: req.params.id });
        if (!part) {
            res.status(404).json({ error: "Part not found" });
            return;
        }
        await AuditLog_js_1.default.create({
            id: `AUD-${Date.now()}`,
            userId: "USR-1",
            userName: "Marcus Vance",
            role: "Admin",
            action: "Delete Part",
            target: `Deleted part ${part.name}`,
        });
        res.json({ message: "Part deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deletePart = deletePart;
