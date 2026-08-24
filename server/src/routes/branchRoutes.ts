import { Router } from "express";
import { getBranches, createBranch } from "../controllers/branchController.js";

const router = Router();

router.get("/", getBranches);
router.post("/", createBranch);

export default router;
