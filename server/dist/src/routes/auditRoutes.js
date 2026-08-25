"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auditController_js_1 = require("../controllers/auditController.js");
const router = (0, express_1.Router)();
router.get("/", auditController_js_1.getAuditLogs);
exports.default = router;
