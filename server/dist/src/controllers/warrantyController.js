"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWarranty = exports.updateWarranty = exports.addClaim = exports.createWarranty = exports.getWarrantyById = exports.getWarranties = void 0;
const Warranty_js_1 = __importDefault(require("../models/Warranty.js"));
const AuditLog_js_1 = __importDefault(require("../models/AuditLog.js"));
const getWarranties = async (req, res) => {
    try {
        const { status, vehicleId } = req.query;
        let query = {};
        if (status)
            query.status = status;
        if (vehicleId)
            query.vehicleId = vehicleId;
        const warranties = await Warranty_js_1.default.find(query).sort({ createdAt: -1 });
        res.json(warranties);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getWarranties = getWarranties;
const getWarrantyById = async (req, res) => {
    try {
        const idStr = String(req.params.id);
        const warranty = await Warranty_js_1.default.findOne({ id: idStr });
        if (!warranty) {
            res.status(404).json({ error: "Warranty policy not found" });
            return;
        }
        res.json(warranty);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getWarrantyById = getWarrantyById;
const createWarranty = async (req, res) => {
    try {
        const body = req.body;
        const newWarranty = new Warranty_js_1.default({
            id: body.id || `WR-${Date.now().toString().substring(10)}`,
            vehicleId: body.vehicleId,
            vehicleName: body.vehicleName || "",
            customerName: body.customerName || "",
            coverageType: body.coverageType || "Standard",
            startDate: body.startDate,
            endDate: body.endDate,
            status: body.status || "Active",
            partsCovered: body.partsCovered || [],
            laborCovered: body.laborCovered !== undefined ? body.laborCovered : true,
            claims: body.claims || [],
        });
        await newWarranty.save();
        await AuditLog_js_1.default.create({
            id: `AUD-${Date.now()}`,
            userId: "USR-2",
            userName: "Elena Rostova",
            role: "Manager",
            action: "Create Warranty Policy",
            target: `Created warranty ${newWarranty.id} for ${newWarranty.vehicleName}`,
        });
        res.status(201).json(newWarranty);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createWarranty = createWarranty;
const addClaim = async (req, res) => {
    try {
        const idStr = String(req.params.id);
        const body = req.body;
        const warranty = await Warranty_js_1.default.findOne({ id: idStr });
        if (!warranty) {
            res.status(404).json({ error: "Warranty policy not found" });
            return;
        }
        const claim = {
            id: body.id || `CLM-${Date.now()}`,
            warrantyId: idStr,
            customerName: body.customerName || warranty.customerName,
            vehicleName: body.vehicleName || warranty.vehicleName,
            description: body.description || "",
            status: body.status || "Pending",
            estimatedCost: body.estimatedCost || 0,
            createdAt: new Date().toISOString(),
        };
        if (!warranty.claims)
            warranty.claims = [];
        warranty.claims.unshift(claim);
        await warranty.save();
        await AuditLog_js_1.default.create({
            id: `AUD-${Date.now()}`,
            userId: "USR-3",
            userName: "Kenji Sato",
            role: "Service Advisor",
            action: "Submit Warranty Claim",
            target: `Submitted claim ${claim.id} under policy ${warranty.id}`,
        });
        res.status(201).json(claim);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.addClaim = addClaim;
const updateWarranty = async (req, res) => {
    try {
        const idStr = String(req.params.id);
        const warranty = await Warranty_js_1.default.findOneAndUpdate({ id: idStr }, req.body, { new: true });
        if (!warranty) {
            res.status(404).json({ error: "Warranty policy not found" });
            return;
        }
        res.json(warranty);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateWarranty = updateWarranty;
const deleteWarranty = async (req, res) => {
    try {
        const idStr = String(req.params.id);
        const warranty = await Warranty_js_1.default.findOneAndDelete({ id: idStr });
        if (!warranty) {
            res.status(404).json({ error: "Warranty policy not found" });
            return;
        }
        res.json({ message: "Warranty policy deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteWarranty = deleteWarranty;
