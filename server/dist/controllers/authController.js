"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const User_js_1 = __importDefault(require("../models/User.js"));
const AuditLog_js_1 = __importDefault(require("../models/AuditLog.js"));
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_js_1.default.findOne({ email });
        if (!user || user.passwordHash !== password) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }
        await AuditLog_js_1.default.create({
            id: `AUD-${Date.now()}`,
            userId: user.id,
            userName: user.name,
            role: user.role,
            action: "User Login",
            target: `User ${user.email} logged in`,
        });
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            status: user.status,
            branchId: user.branchId,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.login = login;
