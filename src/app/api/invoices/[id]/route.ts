import { NextRequest, NextResponse } from "next/server";
import { readDb, saveDb } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = readDb();
    const idx = db.invoices.findIndex((inv: any) => inv.id === id);

    if (idx !== -1) {
      db.invoices[idx] = { ...db.invoices[idx], ...body };

      // Create notification if status shifts to Paid
      if (db.invoices[idx].status === "Paid") {
        db.notifications.unshift({
          id: `NTF-${Date.now()}`,
          title: "Invoice Settled",
          message: `Invoice ${db.invoices[idx].id} total of $${db.invoices[idx].total} paid successfully.`,
          type: "payment",
          createdAt: new Date().toISOString(),
          read: false,
        });
      }

      saveDb(db);
      return NextResponse.json(db.invoices[idx]);
    }

    return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
