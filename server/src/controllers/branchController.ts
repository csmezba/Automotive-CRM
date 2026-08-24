import { Request, Response } from "express";
import Branch from "../models/Branch.js";

export const getBranches = async (req: Request, res: Response): Promise<void> => {
  try {
    const branches = await Branch.find();
    res.json(branches);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createBranch = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const newBranch = new Branch({
      id: body.id || `BR-${Date.now()}`,
      name: body.name,
      location: body.location,
      phone: body.phone,
    });
    await newBranch.save();
    res.status(201).json(newBranch);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
