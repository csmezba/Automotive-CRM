import { NextRequest, NextResponse } from "next/server";
import { readDb, saveDb, logAudit } from "@/lib/db";

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.bookings);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = readDb();
    const newBooking = {
      id: `BK-${100 + db.bookings.length + 1}`,
      customerId: body.customerId,
      customerName: body.customerName || "Customer",
      customerPhone: body.customerPhone || "Unlisted",
      vehicleId: body.vehicleId,
      vehicleName: body.vehicleName || "Vehicle",
      licensePlate: body.licensePlate || "",
      mechanicId: body.mechanicId || undefined,
      mechanicName: body.mechanicName || undefined,
      serviceType: body.serviceType || "Oil Change",
      bookingDate: body.bookingDate || new Date().toISOString().split("T")[0],
      bookingTime: body.bookingTime || "09:00",
      status: body.status || "Pending",
      estimatedCost: Number(body.estimatedCost) || 150.0,
      estimatedTimeHours: Number(body.estimatedTimeHours) || 2,
      pickupRequired: !!body.pickupRequired,
      dropRequired: !!body.dropRequired,
      checklist: body.checklist || [
        { id: "ck-1", item: "Safety visual inspect", checked: false },
        { id: "ck-2", item: "Fluid top-offs", checked: false },
        { id: "ck-3", item: "Battery health scan", checked: false }
      ],
      customerNotes: body.customerNotes || "",
      mechanicNotes: body.mechanicNotes || "",
      beforeImages: body.beforeImages || [],
      afterImages: body.afterImages || [],
    };

    db.bookings.unshift(newBooking);

    // Sync vehicle status
    const vIdx = db.vehicles.findIndex((v: any) => v.id === newBooking.vehicleId);
    if (vIdx !== -1) {
      db.vehicles[vIdx].status = "In Service";
    }

    // Trigger notification
    db.notifications.unshift({
      id: `NTF-${Date.now()}`,
      title: "New Booking Added",
      message: `${newBooking.customerName} scheduled ${newBooking.serviceType} for ${newBooking.bookingDate}.`,
      type: "booking",
      createdAt: new Date().toISOString(),
      read: false,
    });

    saveDb(db);
    logAudit("Create Booking", `Booking ${newBooking.id} added`, { id: "USR-3", name: "Kenji Sato", role: "Service Advisor" });
    return NextResponse.json(newBooking, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
