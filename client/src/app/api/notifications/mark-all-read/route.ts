import { NextResponse } from "next/server";
import { readDb, saveDb } from "@/lib/db";

export async function POST() {
  const db = readDb();
  db.notifications.forEach((n: any) => (n.read = true));
  saveDb(db);
  return NextResponse.json({ success: true });
}
