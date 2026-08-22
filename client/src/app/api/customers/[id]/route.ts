import { NextRequest, NextResponse } from "next/server";
import { readDb, saveDb } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = readDb();
    const idx = db.customers.findIndex((c: any) => c.id === id);

    if (idx !== -1) {
      db.customers[idx] = { ...db.customers[idx], ...body };
      saveDb(db);
      return NextResponse.json(db.customers[idx]);
    }

    return NextResponse.json({ message: "Customer not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = readDb();
    db.customers = db.customers.filter((c: any) => c.id !== id);
    saveDb(db);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
