import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";

export async function GET() {
  const db = readDb();
  const hydrated = db.warranties.map((w: any) => ({
    ...w,
    claims: (db.claims || [])
      .filter((c: any) => c.warrantyId === w.id)
      .map((c: any) => ({
        id: c.id,
        partName: c.partName || (c.description ? c.description.split(" ")[0] : "Parts"),
        description: c.description,
        cost: c.cost || c.estimatedCost || 0,
        claimDate: c.claimDate || (c.createdAt ? c.createdAt.split("T")[0] : "2026-07-18"),
        status: c.status,
      })),
  }));
  return NextResponse.json(hydrated);
}
