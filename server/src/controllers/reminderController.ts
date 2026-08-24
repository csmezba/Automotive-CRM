import { Request, Response } from "express";
import Reminder from "../models/Reminder.js";

export const getReminders = async (req: Request, res: Response): Promise<void> => {
  try {
    const reminders = await Reminder.find().sort({ createdAt: -1 });
    res.json(reminders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createReminder = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const newReminder = new Reminder({
      id: body.id || `REM-${Date.now()}`,
      customerId: body.customerId,
      customerName: body.customerName,
      type: body.type,
      dueDate: body.dueDate,
      status: body.status || "Pending",
      channel: body.channel || "Email",
    });
    await newReminder.save();
    res.status(201).json(newReminder);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateReminder = async (req: Request, res: Response): Promise<void> => {
  try {
    const reminder = await Reminder.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!reminder) {
      res.status(404).json({ error: "Reminder not found" });
      return;
    }
    res.json(reminder);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteReminder = async (req: Request, res: Response): Promise<void> => {
  try {
    const reminder = await Reminder.findOneAndDelete({ id: req.params.id });
    if (!reminder) {
      res.status(404).json({ error: "Reminder not found" });
      return;
    }
    res.json({ message: "Reminder deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
