"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllRead = exports.createNotification = exports.getNotifications = void 0;
const Notification_js_1 = __importDefault(require("../models/Notification.js"));
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification_js_1.default.find().sort({ createdAt: -1 });
        res.json(notifications);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getNotifications = getNotifications;
const createNotification = async (req, res) => {
    try {
        const body = req.body;
        const newNotification = new Notification_js_1.default({
            id: body.id || `NTF-${Date.now()}`,
            title: body.title,
            message: body.message,
            type: body.type || "info",
            createdAt: new Date().toISOString(),
            read: false,
        });
        await newNotification.save();
        res.status(201).json(newNotification);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createNotification = createNotification;
const markAllRead = async (req, res) => {
    try {
        await Notification_js_1.default.updateMany({ read: false }, { read: true });
        res.json({ message: "All notifications marked as read" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.markAllRead = markAllRead;
