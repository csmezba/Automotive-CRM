import { Request, Response } from "express";
import Invoice from "../models/Invoice.js";
import AuditLog from "../models/AuditLog.js";

export const getInvoices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, customerId } = req.query;
    let query: any = {};
    if (status) query.status = status;
    if (customerId) query.customerId = customerId;

    const invoices = await Invoice.find(query).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getInvoiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const invoice = await Invoice.findOne({ id: req.params.id });
    if (!invoice) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }
    res.json(invoice);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const newInvoice = new Invoice({
      id: body.id || `INV-${Date.now().toString().substring(8)}`,
      bookingId: body.bookingId,
      customerId: body.customerId,
      customerName: body.customerName,
      customerEmail: body.customerEmail || "",
      customerPhone: body.customerPhone || "",
      vehicleId: body.vehicleId || "",
      vehicleName: body.vehicleName || "",
      licensePlate: body.licensePlate || "",
      items: body.items || [],
      subtotal: body.subtotal || 0,
      taxRate: body.taxRate || 0.15,
      tax: body.tax || 0,
      discountAmount: body.discountAmount || 0,
      discount: body.discount || 0,
      couponCode: body.couponCode || "",
      total: body.total || body.totalAmount || 0,
      totalAmount: body.totalAmount || body.total || 0,
      status: body.status || "Unpaid",
      paymentMethod: body.paymentMethod || "Credit Card",
      paymentDate: body.paymentDate || "",
      dueDate: body.dueDate || "",
      createdAt: new Date().toISOString(),
    });
    await newInvoice.save();

    await AuditLog.create({
      id: `AUD-${Date.now()}`,
      userId: "USR-2",
      userName: "Elena Rostova",
      role: "Manager",
      action: "Create Invoice",
      target: `Generated invoice ${newInvoice.id} for ${newInvoice.customerName}`,
    });

    res.status(201).json(newInvoice);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const invoice = await Invoice.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!invoice) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }

    await AuditLog.create({
      id: `AUD-${Date.now()}`,
      userId: "USR-2",
      userName: "Elena Rostova",
      role: "Manager",
      action: "Update Invoice",
      target: `Updated invoice ${invoice.id} status to ${invoice.status}`,
    });

    res.json(invoice);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const invoice = await Invoice.findOneAndDelete({ id: req.params.id });
    if (!invoice) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }

    res.json({ message: "Invoice deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
