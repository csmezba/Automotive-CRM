import { Request, Response } from "express";
import Booking from "../models/Booking.js";
import AuditLog from "../models/AuditLog.js";

export const getBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, mechanicId, customerId } = req.query;
    let query: any = {};

    if (status) query.status = status;
    if (mechanicId) query.mechanicId = mechanicId;
    if (customerId) query.customerId = customerId;

    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findOne({ id: req.params.id });
    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }
    res.json(booking);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const newBooking = new Booking({
      id: body.id || `BK-${Date.now().toString().substring(8)}`,
      customerId: body.customerId,
      customerName: body.customerName || "",
      customerPhone: body.customerPhone || "",
      vehicleId: body.vehicleId,
      vehicleName: body.vehicleName || "",
      licensePlate: body.licensePlate || "",
      mechanicId: body.mechanicId || "",
      mechanicName: body.mechanicName || "",
      serviceType: body.serviceType,
      bookingDate: body.bookingDate,
      bookingTime: body.bookingTime || "09:00",
      status: body.status || "Scheduled",
      estimatedCost: body.estimatedCost || 0,
      estimatedTimeHours: body.estimatedTimeHours || 1,
      pickupRequired: body.pickupRequired || false,
      dropRequired: body.dropRequired || false,
      customerNotes: body.customerNotes || "",
      mechanicNotes: body.mechanicNotes || "",
      checklist: body.checklist || [],
      beforeImages: body.beforeImages || [],
      afterImages: body.afterImages || [],
    });
    await newBooking.save();

    await AuditLog.create({
      id: `AUD-${Date.now()}`,
      userId: "USR-3",
      userName: "Kenji Sato",
      role: "Service Advisor",
      action: "Create Booking",
      target: `Created booking ${newBooking.id} for ${newBooking.customerName}`,
    });

    res.status(201).json(newBooking);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    await AuditLog.create({
      id: `AUD-${Date.now()}`,
      userId: "USR-3",
      userName: "Kenji Sato",
      role: "Service Advisor",
      action: "Update Booking",
      target: `Updated booking ${booking.id}`,
    });

    res.json(booking);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findOneAndDelete({ id: req.params.id });
    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    await AuditLog.create({
      id: `AUD-${Date.now()}`,
      userId: "USR-1",
      userName: "Marcus Vance",
      role: "Admin",
      action: "Delete Booking",
      target: `Deleted booking ${booking.id}`,
    });

    res.json({ message: "Booking deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
