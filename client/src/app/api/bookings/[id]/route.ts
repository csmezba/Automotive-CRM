import { NextRequest, NextResponse } from "next/server";
import { readDb, saveDb } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = readDb();
    const idx = db.bookings.findIndex((b: any) => b.id === id);

    if (idx !== -1) {
      const oldStatus = db.bookings[idx].status;
      db.bookings[idx] = { ...db.bookings[idx], ...body };

      // Sync vehicle status if booking status shifts
      if (oldStatus !== db.bookings[idx].status) {
        const vIdx = db.vehicles.findIndex((v: any) => v.id === db.bookings[idx].vehicleId);
        if (vIdx !== -1) {
          if (db.bookings[idx].status === "Ready") {
            db.vehicles[vIdx].status = "Ready for Pickup";
          } else if (db.bookings[idx].status === "Completed") {
            db.vehicles[vIdx].status = "Completed";
            
            // Add Loyalty points for completed services
            const cIdx = db.customers.findIndex((c: any) => c.id === db.bookings[idx].customerId);
            if (cIdx !== -1) {
              db.customers[cIdx].loyaltyPoints += 50;
            }
          } else {
            db.vehicles[vIdx].status = "In Service";
          }
        }
      }

      saveDb(db);
      return NextResponse.json(db.bookings[idx]);
    }

    return NextResponse.json({ message: "Booking not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = readDb();
    db.bookings = db.bookings.filter((b: any) => b.id !== id);
    saveDb(db);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
