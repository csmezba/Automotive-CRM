"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.getSettings = void 0;
const Settings_js_1 = __importDefault(require("../models/Settings.js"));
const getSettings = async (req, res) => {
    try {
        let settings = await Settings_js_1.default.findOne();
        if (!settings) {
            settings = await Settings_js_1.default.create({
                companyName: "Apex Auto Care",
                taxRate: 0.15,
                currency: "USD",
                workingHoursStart: "08:00",
                workingHoursEnd: "18:00",
                aiAutoAnalyze: true,
                smsEnabled: true,
                emailEnabled: true,
            });
        }
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getSettings = getSettings;
const updateSettings = async (req, res) => {
    try {
        let settings = await Settings_js_1.default.findOne();
        if (settings) {
            Object.assign(settings, req.body);
            await settings.save();
        }
        else {
            settings = await Settings_js_1.default.create(req.body);
        }
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateSettings = updateSettings;
