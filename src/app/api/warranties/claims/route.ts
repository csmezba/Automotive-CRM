import { NextRequest, NextResponse } from "next/server";
import { readDb, saveDb } from "@/lib/db";

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.claims);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = readDb();
    const newClaim = {
      id: `CLM-${100 + db.claims.length + 1}`,
      warrantyId: body.warrantyId,
      customerName: body.customerName,
      vehicleName: body.vehicleName,
      description: body.description,
      status: "Pending",
      estimatedCost: Number(body.estimatedCost) || 120.0,
      createdAt: new Date().toISOString(),
    };
    db.claims.unshift(newClaim);
    saveDb(db);
    return NextResponse.json(newClaim, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
