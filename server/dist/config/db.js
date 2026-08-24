"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const connStr = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/automotive_crm";
        const conn = await mongoose_1.default.connect(connStr);
        console.log(`[MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
    }
    catch (error) {
        console.error("[MongoDB] Connection Error:", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
