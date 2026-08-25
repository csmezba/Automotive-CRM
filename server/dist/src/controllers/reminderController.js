"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReminder = exports.updateReminder = exports.createReminder = exports.getReminders = void 0;
const Reminder_js_1 = __importDefault(require("../models/Reminder.js"));
const getReminders = async (req, res) => {
    try {
        const reminders = await Reminder_js_1.default.find().sort({ createdAt: -1 });
        res.json(reminders);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getReminders = getReminders;
const createReminder = async (req, res) => {
    try {
        const body = req.body;
        const newReminder = new Reminder_js_1.default({
            id: body.id || `REM-${Date.now()}`,
            customerId: body.customerId,
            customerName: body.customerName,
            type: body.type,
            dueDate: body.dueDate,
            status: body.status || "Pending",
            channel: body.channel || "Email",
        });
        await newReminder.save();
        res.status(201).json(newReminder);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createReminder = createReminder;
const updateReminder = async (req, res) => {
    try {
        const reminder = await Reminder_js_1.default.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (!reminder) {
            res.status(404).json({ error: "Reminder not found" });
            return;
        }
        res.json(reminder);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateReminder = updateReminder;
const deleteReminder = async (req, res) => {
    try {
        const reminder = await Reminder_js_1.default.findOneAndDelete({ id: req.params.id });
        if (!reminder) {
            res.status(404).json({ error: "Reminder not found" });
            return;
        }
        res.json({ message: "Reminder deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteReminder = deleteReminder;
