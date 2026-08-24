import { Request, Response } from "express";
import AuditLog from "../models/AuditLog.js";

export const getAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(200);
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
