"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_js_1 = require("../controllers/dashboardController.js");
const router = (0, express_1.Router)();
router.get("/stats", dashboardController_js_1.getDashboardStats);
exports.default = router;
