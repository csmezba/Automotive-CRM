import { NextRequest, NextResponse } from "next/server";
import { readDb, saveDb } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = readDb();
    const idx = db.reminders.findIndex((r: any) => r.id === id);

    if (idx !== -1) {
      db.reminders[idx] = { ...db.reminders[idx], ...body };
      saveDb(db);
      return NextResponse.json(db.reminders[idx]);
    }

    return NextResponse.json({ message: "Reminder not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
