import { Request, Response } from "express";
import Mechanic from "../models/Mechanic.js";
import AuditLog from "../models/AuditLog.js";

export const getMechanics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    let query: any = {};
    if (status) query.status = status;

    const mechanics = await Mechanic.find(query).sort({ createdAt: -1 });
    res.json(mechanics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMechanicById = async (req: Request, res: Response): Promise<void> => {
  try {
    const mechanic = await Mechanic.findOne({ id: req.params.id });
    if (!mechanic) {
      res.status(404).json({ error: "Mechanic not found" });
      return;
    }
    res.json(mechanic);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createMechanic = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const newMechanic = new Mechanic({
      id: body.id || `MECH-${Date.now().toString().substring(10)}`,
      name: body.name,
      email: body.email || "",
      skills: body.skills || [],
      status: body.status || "Available",
      rating: body.rating || 5.0,
      completedJobs: body.completedJobs || 0,
      workingHours: body.workingHours || "08:00 - 17:00",
      attendanceStatus: body.attendanceStatus || "Present",
      efficiencyScore: body.efficiencyScore || 95,
      activeJobsCount: body.activeJobsCount || 0,
    });
    await newMechanic.save();

    await AuditLog.create({
      id: `AUD-${Date.now()}`,
      userId: "USR-1",
      userName: "Marcus Vance",
      role: "Admin",
      action: "Create Mechanic",
      target: `Added technician ${newMechanic.name}`,
    });

    res.status(201).json(newMechanic);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMechanic = async (req: Request, res: Response): Promise<void> => {
  try {
    const mechanic = await Mechanic.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!mechanic) {
      res.status(404).json({ error: "Mechanic not found" });
      return;
    }

    res.json(mechanic);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMechanic = async (req: Request, res: Response): Promise<void> => {
  try {
    const mechanic = await Mechanic.findOneAndDelete({ id: req.params.id });
    if (!mechanic) {
      res.status(404).json({ error: "Mechanic not found" });
      return;
    }

    res.json({ message: "Mechanic deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
