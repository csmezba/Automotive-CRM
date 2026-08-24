import { Request, Response } from "express";
import Part from "../models/Part.js";
import AuditLog from "../models/AuditLog.js";

export const getParts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search } = req.query;
    let query: any = {};

    if (category) query.category = category;
    if (search) {
      const q = String(search);
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { sku: { $regex: q, $options: "i" } },
        { supplier: { $regex: q, $options: "i" } },
      ];
    }

    const parts = await Part.find(query).sort({ createdAt: -1 });
    res.json(parts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPartById = async (req: Request, res: Response): Promise<void> => {
  try {
    const part = await Part.findOne({ id: req.params.id });
    if (!part) {
      res.status(404).json({ error: "Part not found" });
      return;
    }
    res.json(part);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createPart = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const newPart = new Part({
      id: body.id || `PART-${Date.now().toString().substring(10)}`,
      name: body.name,
      sku: body.sku,
      category: body.category || "General",
      stock: body.stock || 0,
      minStock: body.minStock || 5,
      purchasePrice: body.purchasePrice || 0,
      sellingPrice: body.sellingPrice || 0,
      supplier: body.supplier || "",
      warehouseLocation: body.warehouseLocation || "",
      compatibleVehicles: body.compatibleVehicles || [],
    });
    await newPart.save();

    await AuditLog.create({
      id: `AUD-${Date.now()}`,
      userId: "USR-2",
      userName: "Elena Rostova",
      role: "Manager",
      action: "Create Part",
      target: `Created spare part ${newPart.name} (${newPart.sku})`,
    });

    res.status(201).json(newPart);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePart = async (req: Request, res: Response): Promise<void> => {
  try {
    const part = await Part.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!part) {
      res.status(404).json({ error: "Part not found" });
      return;
    }

    await AuditLog.create({
      id: `AUD-${Date.now()}`,
      userId: "USR-2",
      userName: "Elena Rostova",
      role: "Manager",
      action: "Update Part Inventory",
      target: `Updated part ${part.name}`,
    });

    res.json(part);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePart = async (req: Request, res: Response): Promise<void> => {
  try {
    const part = await Part.findOneAndDelete({ id: req.params.id });
    if (!part) {
      res.status(404).json({ error: "Part not found" });
      return;
    }

    await AuditLog.create({
      id: `AUD-${Date.now()}`,
      userId: "USR-1",
      userName: "Marcus Vance",
      role: "Admin",
      action: "Delete Part",
      target: `Deleted part ${part.name}`,
    });

    res.json({ message: "Part deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
