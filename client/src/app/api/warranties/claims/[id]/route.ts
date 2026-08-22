import { NextRequest, NextResponse } from "next/server";
import { readDb, saveDb } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = readDb();
    const idx = db.claims.findIndex((c: any) => c.id === id);

    if (idx !== -1) {
      db.claims[idx] = { ...db.claims[idx], ...body };
      saveDb(db);
      return NextResponse.json(db.claims[idx]);
    }

    return NextResponse.json({ message: "Claim not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
