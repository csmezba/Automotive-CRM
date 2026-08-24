"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_js_1 = __importDefault(require("./app.js"));
const db_js_1 = require("./config/db.js");
const seed_js_1 = require("./seed.js");
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        await (0, db_js_1.connectDB)();
        await (0, seed_js_1.seedDatabase)();
        app_js_1.default.listen(PORT, () => {
            console.log(`[Express Server] Automotive CRM API running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
