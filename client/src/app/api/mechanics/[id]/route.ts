import { NextRequest, NextResponse } from "next/server";
import { readDb, saveDb } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = readDb();
    const idx = db.mechanics.findIndex((m: any) => m.id === id);

    if (idx !== -1) {
      db.mechanics[idx] = { ...db.mechanics[idx], ...body };
      saveDb(db);
      return NextResponse.json(db.mechanics[idx]);
    }

    return NextResponse.json({ message: "Mechanic not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
