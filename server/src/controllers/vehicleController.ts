import { Request, Response } from "express";
import Vehicle from "../models/Vehicle.js";
import AuditLog from "../models/AuditLog.js";

export const getVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, customerId, status } = req.query;
    let query: any = {};

    if (search) {
      const q = String(search);
      query.$or = [
        { brand: { $regex: q, $options: "i" } },
        { model: { $regex: q, $options: "i" } },
        { licensePlate: { $regex: q, $options: "i" } },
        { vin: { $regex: q, $options: "i" } },
      ];
    }
    if (customerId) query.customerId = customerId;
    if (status) query.status = status;

    const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getVehicleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicle = await Vehicle.findOne({ id: req.params.id });
    if (!vehicle) {
      res.status(404).json({ error: "Vehicle not found" });
      return;
    }
    res.json(vehicle);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const newVeh = new Vehicle({
      id: body.id || `VEH-${Date.now()}`,
      customerId: body.customerId,
      customerName: body.customerName || "",
      vin: body.vin || "",
      licensePlate: body.licensePlate,
      brand: body.brand,
      model: body.model,
      variant: body.variant || "",
      year: body.year || new Date().getFullYear(),
      color: body.color || "",
      fuelType: body.fuelType || "Petrol",
      transmission: body.transmission || "Automatic",
      mileage: body.mileage || 0,
      insuranceExpiry: body.insuranceExpiry || "",
      warrantyExpiry: body.warrantyExpiry || "",
      status: body.status || "In Service",
      images: body.images || [],
      accidentHistory: body.accidentHistory || [],
    });
    await newVeh.save();

    await AuditLog.create({
      id: `AUD-${Date.now()}`,
      userId: "USR-1",
      userName: "Marcus Vance",
      role: "Admin",
      action: "Create Vehicle",
      target: `Created vehicle ${newVeh.brand} ${newVeh.model} (${newVeh.licensePlate})`,
    });

    res.status(201).json(newVeh);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!vehicle) {
      res.status(404).json({ error: "Vehicle not found" });
      return;
    }

    await AuditLog.create({
      id: `AUD-${Date.now()}`,
      userId: "USR-1",
      userName: "Marcus Vance",
      role: "Admin",
      action: "Update Vehicle",
      target: `Updated vehicle ${vehicle.licensePlate}`,
    });

    res.json(vehicle);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({ id: req.params.id });
    if (!vehicle) {
      res.status(404).json({ error: "Vehicle not found" });
      return;
    }

    await AuditLog.create({
      id: `AUD-${Date.now()}`,
      userId: "USR-1",
      userName: "Marcus Vance",
      role: "Admin",
      action: "Delete Vehicle",
      target: `Deleted vehicle ${vehicle.licensePlate}`,
    });

    res.json({ message: "Vehicle deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
