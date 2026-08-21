import { NextRequest, NextResponse } from "next/server";
import { readDb, saveDb } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = readDb();
    const idx = db.parts.findIndex((p: any) => p.id === id);

    if (idx !== -1) {
      db.parts[idx] = { ...db.parts[idx], ...body };
      // Automatically trigger alert if part is low stock
      if (db.parts[idx].stock < db.parts[idx].minStock) {
        db.notifications.unshift({
          id: `NTF-${Date.now()}`,
          title: "Low Stock Triggered",
          message: `${db.parts[idx].name} has fallen below safe threshold.`,
          type: "stock",
          createdAt: new Date().toISOString(),
          read: false,
        });
      }
      saveDb(db);
      return NextResponse.json(db.parts[idx]);
    }

    return NextResponse.json({ message: "Part not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
