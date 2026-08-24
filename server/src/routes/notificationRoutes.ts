import { Router } from "express";
import {
  getNotifications,
  createNotification,
  markAllRead,
} from "../controllers/notificationController.js";

const router = Router();

router.get("/", getNotifications);
router.post("/", createNotification);
router.post("/mark-all-read", markAllRead);

export default router;
