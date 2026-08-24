import { Request, Response } from "express";
import Notification from "../models/Notification.js";

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const newNotification = new Notification({
      id: body.id || `NTF-${Date.now()}`,
      title: body.title,
      message: body.message,
      type: body.type || "info",
      createdAt: new Date().toISOString(),
      read: false,
    });
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const markAllRead = async (req: Request, res: Response): Promise<void> => {
  try {
    await Notification.updateMany({ read: false }, { read: true });
    res.json({ message: "All notifications marked as read" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
