"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = void 0;
const AuditLog_js_1 = __importDefault(require("../models/AuditLog.js"));
const getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog_js_1.default.find().sort({ createdAt: -1 }).limit(200);
        res.json(logs);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAuditLogs = getAuditLogs;
