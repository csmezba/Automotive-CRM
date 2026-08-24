"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBranch = exports.getBranches = void 0;
const Branch_js_1 = __importDefault(require("../models/Branch.js"));
const getBranches = async (req, res) => {
    try {
        const branches = await Branch_js_1.default.find();
        res.json(branches);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getBranches = getBranches;
const createBranch = async (req, res) => {
    try {
        const body = req.body;
        const newBranch = new Branch_js_1.default({
            id: body.id || `BR-${Date.now()}`,
            name: body.name,
            location: body.location,
            phone: body.phone,
        });
        await newBranch.save();
        res.status(201).json(newBranch);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createBranch = createBranch;
