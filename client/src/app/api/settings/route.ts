import { NextRequest, NextResponse } from "next/server";
import { readDb, saveDb } from "@/lib/db";

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.settings);
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const db = readDb();
    db.settings = { ...db.settings, ...body };
    saveDb(db);
    return NextResponse.json({ success: true, settings: db.settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
