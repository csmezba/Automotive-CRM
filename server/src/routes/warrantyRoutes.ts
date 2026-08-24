import { Router } from "express";
import {
  getWarranties,
  getWarrantyById,
  createWarranty,
  addClaim,
  updateWarranty,
  deleteWarranty,
} from "../controllers/warrantyController.js";

const router = Router();

router.get("/", getWarranties);
router.get("/:id", getWarrantyById);
router.post("/", createWarranty);
router.post("/:id/claims", addClaim);
router.put("/:id", updateWarranty);
router.delete("/:id", deleteWarranty);

export default router;
