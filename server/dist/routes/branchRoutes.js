"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const branchController_js_1 = require("../controllers/branchController.js");
const router = (0, express_1.Router)();
router.get("/", branchController_js_1.getBranches);
router.post("/", branchController_js_1.createBranch);
exports.default = router;
