import { NextRequest, NextResponse } from "next/server";
import { readDb, saveDb } from "@/lib/db";

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.reminders);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = readDb();
    const newReminder = {
      id: `REM-${Date.now()}`,
      customerId: body.customerId,
      customerName: body.customerName,
      type: body.type,
      dueDate: body.dueDate,
      status: "Pending",
      channel: body.channel || "Email",
    };
    db.reminders.unshift(newReminder);
    saveDb(db);
    return NextResponse.json(newReminder, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
