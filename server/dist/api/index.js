"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const app_js_1 = __importDefault(require("../src/app.js"));
const db_js_1 = require("../src/config/db.js");
async function handler(req, res) {
    await (0, db_js_1.connectDB)();
    return (0, app_js_1.default)(req, res);
}
