import { Request, Response } from "express";
import Customer from "../models/Customer.js";
import AuditLog from "../models/AuditLog.js";

export const getCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, group, status } = req.query;
    let query: any = {};

    if (search) {
      const q = String(search);
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
      ];
    }
    if (group) query.group = group;
    if (status) query.status = status;

    const customers = await Customer.find(query).sort({ createdAt: -1 });
    res.json(customers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await Customer.findOne({ id: req.params.id });
    if (!customer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }
    res.json(customer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const newCust = new Customer({
      id: body.id || `CUST-${Date.now()}`,
      name: body.name,
      email: body.email || "",
      phone: body.phone || "",
      status: body.status || "Active",
      loyaltyPoints: body.loyaltyPoints || 0,
      tags: body.tags || [],
      group: body.group || "Retail",
      notes: body.notes || [],
      documents: body.documents || [],
      createdAt: new Date().toISOString(),
    });
    await newCust.save();

    await AuditLog.create({
      id: `AUD-${Date.now()}`,
      userId: "USR-1",
      userName: "Marcus Vance",
      role: "Admin",
      action: "Create Customer",
      target: `Created customer ${newCust.name}`,
    });

    res.status(201).json(newCust);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await Customer.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!customer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }

    await AuditLog.create({
      id: `AUD-${Date.now()}`,
      userId: "USR-1",
      userName: "Marcus Vance",
      role: "Admin",
      action: "Update Customer",
      target: `Updated customer ${customer.name}`,
    });

    res.json(customer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await Customer.findOneAndDelete({ id: req.params.id });
    if (!customer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }

    await AuditLog.create({
      id: `AUD-${Date.now()}`,
      userId: "USR-1",
      userName: "Marcus Vance",
      role: "Admin",
      action: "Delete Customer",
      target: `Deleted customer ${customer.name}`,
    });

    res.json({ message: "Customer deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
