"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_js_1 = require("../controllers/notificationController.js");
const router = (0, express_1.Router)();
router.get("/", notificationController_js_1.getNotifications);
router.post("/", notificationController_js_1.createNotification);
router.post("/mark-all-read", notificationController_js_1.markAllRead);
exports.default = router;
