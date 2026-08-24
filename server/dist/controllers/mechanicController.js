"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMechanic = exports.updateMechanic = exports.createMechanic = exports.getMechanicById = exports.getMechanics = void 0;
const Mechanic_js_1 = __importDefault(require("../models/Mechanic.js"));
const AuditLog_js_1 = __importDefault(require("../models/AuditLog.js"));
const getMechanics = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status)
            query.status = status;
        const mechanics = await Mechanic_js_1.default.find(query).sort({ createdAt: -1 });
        res.json(mechanics);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getMechanics = getMechanics;
const getMechanicById = async (req, res) => {
    try {
        const mechanic = await Mechanic_js_1.default.findOne({ id: req.params.id });
        if (!mechanic) {
            res.status(404).json({ error: "Mechanic not found" });
            return;
        }
        res.json(mechanic);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getMechanicById = getMechanicById;
const createMechanic = async (req, res) => {
    try {
        const body = req.body;
        const newMechanic = new Mechanic_js_1.default({
            id: body.id || `MECH-${Date.now().toString().substring(10)}`,
            name: body.name,
            email: body.email || "",
            skills: body.skills || [],
            status: body.status || "Available",
            rating: body.rating || 5.0,
            completedJobs: body.completedJobs || 0,
            workingHours: body.workingHours || "08:00 - 17:00",
            attendanceStatus: body.attendanceStatus || "Present",
            efficiencyScore: body.efficiencyScore || 95,
            activeJobsCount: body.activeJobsCount || 0,
        });
        await newMechanic.save();
        await AuditLog_js_1.default.create({
            id: `AUD-${Date.now()}`,
            userId: "USR-1",
            userName: "Marcus Vance",
            role: "Admin",
            action: "Create Mechanic",
            target: `Added technician ${newMechanic.name}`,
        });
        res.status(201).json(newMechanic);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createMechanic = createMechanic;
const updateMechanic = async (req, res) => {
    try {
        const mechanic = await Mechanic_js_1.default.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (!mechanic) {
            res.status(404).json({ error: "Mechanic not found" });
            return;
        }
        res.json(mechanic);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateMechanic = updateMechanic;
const deleteMechanic = async (req, res) => {
    try {
        const mechanic = await Mechanic_js_1.default.findOneAndDelete({ id: req.params.id });
        if (!mechanic) {
            res.status(404).json({ error: "Mechanic not found" });
            return;
        }
        res.json({ message: "Mechanic deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteMechanic = deleteMechanic;
