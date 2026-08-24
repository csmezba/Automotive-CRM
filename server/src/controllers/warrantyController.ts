import { Request, Response } from "express";
import Warranty from "../models/Warranty.js";
import AuditLog from "../models/AuditLog.js";

export const getWarranties = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, vehicleId } = req.query;
    let query: any = {};
    if (status) query.status = status;
    if (vehicleId) query.vehicleId = vehicleId;

    const warranties = await Warranty.find(query).sort({ createdAt: -1 });
    res.json(warranties);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getWarrantyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const idStr = String(req.params.id);
    const warranty = await Warranty.findOne({ id: idStr });
    if (!warranty) {
      res.status(404).json({ error: "Warranty policy not found" });
      return;
    }
    res.json(warranty);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createWarranty = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const newWarranty = new Warranty({
      id: body.id || `WR-${Date.now().toString().substring(10)}`,
      vehicleId: body.vehicleId,
      vehicleName: body.vehicleName || "",
      customerName: body.customerName || "",
      coverageType: body.coverageType || "Standard",
      startDate: body.startDate,
      endDate: body.endDate,
      status: body.status || "Active",
      partsCovered: body.partsCovered || [],
      laborCovered: body.laborCovered !== undefined ? body.laborCovered : true,
      claims: body.claims || [],
    });
    await newWarranty.save();

    await AuditLog.create({
      id: `AUD-${Date.now()}`,
      userId: "USR-2",
      userName: "Elena Rostova",
      role: "Manager",
      action: "Create Warranty Policy",
      target: `Created warranty ${newWarranty.id} for ${newWarranty.vehicleName}`,
    });

    res.status(201).json(newWarranty);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addClaim = async (req: Request, res: Response): Promise<void> => {
  try {
    const idStr = String(req.params.id);
    const body = req.body;

    const warranty = await Warranty.findOne({ id: idStr });
    if (!warranty) {
      res.status(404).json({ error: "Warranty policy not found" });
      return;
    }

    const claim = {
      id: body.id || `CLM-${Date.now()}`,
      warrantyId: idStr,
      customerName: body.customerName || warranty.customerName,
      vehicleName: body.vehicleName || warranty.vehicleName,
      description: body.description || "",
      status: body.status || "Pending",
      estimatedCost: body.estimatedCost || 0,
      createdAt: new Date().toISOString(),
    };

    if (!warranty.claims) warranty.claims = [];
    warranty.claims.unshift(claim);
    await warranty.save();

    await AuditLog.create({
      id: `AUD-${Date.now()}`,
      userId: "USR-3",
      userName: "Kenji Sato",
      role: "Service Advisor",
      action: "Submit Warranty Claim",
      target: `Submitted claim ${claim.id} under policy ${warranty.id}`,
    });

    res.status(201).json(claim);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateWarranty = async (req: Request, res: Response): Promise<void> => {
  try {
    const idStr = String(req.params.id);
    const warranty = await Warranty.findOneAndUpdate({ id: idStr }, req.body, { new: true });
    if (!warranty) {
      res.status(404).json({ error: "Warranty policy not found" });
      return;
    }
    res.json(warranty);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteWarranty = async (req: Request, res: Response): Promise<void> => {
  try {
    const idStr = String(req.params.id);
    const warranty = await Warranty.findOneAndDelete({ id: idStr });
    if (!warranty) {
      res.status(404).json({ error: "Warranty policy not found" });
      return;
    }
    res.json({ message: "Warranty policy deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
