"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicle = exports.updateVehicle = exports.createVehicle = exports.getVehicleById = exports.getVehicles = void 0;
const Vehicle_js_1 = __importDefault(require("../models/Vehicle.js"));
const AuditLog_js_1 = __importDefault(require("../models/AuditLog.js"));
const getVehicles = async (req, res) => {
    try {
        const { search, customerId, status } = req.query;
        let query = {};
        if (search) {
            const q = String(search);
            query.$or = [
                { brand: { $regex: q, $options: "i" } },
                { model: { $regex: q, $options: "i" } },
                { licensePlate: { $regex: q, $options: "i" } },
                { vin: { $regex: q, $options: "i" } },
            ];
        }
        if (customerId)
            query.customerId = customerId;
        if (status)
            query.status = status;
        const vehicles = await Vehicle_js_1.default.find(query).sort({ createdAt: -1 });
        res.json(vehicles);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getVehicles = getVehicles;
const getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle_js_1.default.findOne({ id: req.params.id });
        if (!vehicle) {
            res.status(404).json({ error: "Vehicle not found" });
            return;
        }
        res.json(vehicle);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getVehicleById = getVehicleById;
const createVehicle = async (req, res) => {
    try {
        const body = req.body;
        const newVeh = new Vehicle_js_1.default({
            id: body.id || `VEH-${Date.now()}`,
            customerId: body.customerId,
            customerName: body.customerName || "",
            vin: body.vin || "",
            licensePlate: body.licensePlate,
            brand: body.brand,
            model: body.model,
            variant: body.variant || "",
            year: body.year || new Date().getFullYear(),
            color: body.color || "",
            fuelType: body.fuelType || "Petrol",
            transmission: body.transmission || "Automatic",
            mileage: body.mileage || 0,
            insuranceExpiry: body.insuranceExpiry || "",
            warrantyExpiry: body.warrantyExpiry || "",
            status: body.status || "In Service",
            images: body.images || [],
            accidentHistory: body.accidentHistory || [],
        });
        await newVeh.save();
        await AuditLog_js_1.default.create({
            id: `AUD-${Date.now()}`,
            userId: "USR-1",
            userName: "Marcus Vance",
            role: "Admin",
            action: "Create Vehicle",
            target: `Created vehicle ${newVeh.brand} ${newVeh.model} (${newVeh.licensePlate})`,
        });
        res.status(201).json(newVeh);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createVehicle = createVehicle;
const updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle_js_1.default.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (!vehicle) {
            res.status(404).json({ error: "Vehicle not found" });
            return;
        }
        await AuditLog_js_1.default.create({
            id: `AUD-${Date.now()}`,
            userId: "USR-1",
            userName: "Marcus Vance",
            role: "Admin",
            action: "Update Vehicle",
            target: `Updated vehicle ${vehicle.licensePlate}`,
        });
        res.json(vehicle);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateVehicle = updateVehicle;
const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle_js_1.default.findOneAndDelete({ id: req.params.id });
        if (!vehicle) {
            res.status(404).json({ error: "Vehicle not found" });
            return;
        }
        await AuditLog_js_1.default.create({
            id: `AUD-${Date.now()}`,
            userId: "USR-1",
            userName: "Marcus Vance",
            role: "Admin",
            action: "Delete Vehicle",
            target: `Deleted vehicle ${vehicle.licensePlate}`,
        });
        res.json({ message: "Vehicle deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteVehicle = deleteVehicle;
