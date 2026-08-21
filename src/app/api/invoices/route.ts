import { NextRequest, NextResponse } from "next/server";
import { readDb, saveDb } from "@/lib/db";

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.invoices);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, items, taxRate, discountAmount, couponCode, customerId, customerName, customerEmail, vehicleName } = body;
    const db = readDb();

    const subtotal = (items || []).reduce((sum: number, item: any) => sum + item.quantity * item.unitPrice, 0);
    const total = (subtotal - (discountAmount || 0)) * (1 + (taxRate || 0.15));

    const newInvoice = {
      id: `INV-2026-${String(db.invoices.length + 1).padStart(3, "0")}`,
      bookingId,
      customerId,
      customerName,
      customerEmail,
      vehicleName,
      items: items || [],
      subtotal,
      taxRate: taxRate || 0.15,
      discountAmount: discountAmount || 0,
      couponCode,
      total: Math.round(total * 100) / 100,
      status: "Unpaid",
      createdAt: new Date().toISOString(),
    };

    db.invoices.unshift(newInvoice);

    // Link invoice ID to booking
    const bIdx = db.bookings.findIndex((b: any) => b.id === bookingId);
    if (bIdx !== -1) {
      db.bookings[bIdx].invoiceId = newInvoice.id;
    }

    saveDb(db);
    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
