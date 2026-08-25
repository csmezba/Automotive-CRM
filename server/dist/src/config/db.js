"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
let isConnected = false;
const connectDB = async () => {
    if (isConnected || mongoose_1.default.connection.readyState >= 1) {
        return;
    }
    try {
        const connStr = process.env.MONGODB_URI || "";
        if (!connStr) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        const conn = await mongoose_1.default.connect(connStr);
        isConnected = true;
        console.log(`[MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
    }
    catch (error) {
        console.error("[MongoDB] Connection Error:", error);
    }
};
exports.connectDB = connectDB;
