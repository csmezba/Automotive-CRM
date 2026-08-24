import { Request, Response } from "express";
import Settings from "../models/Settings.js";

export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        companyName: "Apex Auto Care",
        taxRate: 0.15,
        currency: "USD",
        workingHoursStart: "08:00",
        workingHoursEnd: "18:00",
        aiAutoAnalyze: true,
        smsEnabled: true,
        emailEnabled: true,
      });
    }
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await Settings.findOne();
    if (settings) {
      Object.assign(settings, req.body);
      await settings.save();
    } else {
      settings = await Settings.create(req.body);
    }
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
