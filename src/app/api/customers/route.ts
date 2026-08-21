import { NextRequest, NextResponse } from "next/server";
import { readDb, saveDb, logAudit } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const group = searchParams.get("group");
  const status = searchParams.get("status");

  const db = readDb();
  let result = [...db.customers];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (c: any) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
    );
  }
  if (group) {
    result = result.filter((c: any) => c.group === group);
  }
  if (status) {
    result = result.filter((c: any) => c.status === status);
  }

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = readDb();
    const newCust = {
      id: `CUST-${Date.now()}`,
      name: body.name,
      email: body.email || "",
      phone: body.phone || "",
      status: body.status || "Active",
      loyaltyPoints: body.loyaltyPoints || 0,
      tags: body.tags || [],
      group: body.group || "Retail",
      notes: body.notes || [],
      documents: body.documents || [],
      createdAt: new Date().toISOString(),
    };
    db.customers.unshift(newCust);
    saveDb(db);
    logAudit("Create Customer", `Created customer ${newCust.name}`, { id: "USR-1", name: "Marcus Vance", role: "Admin" });
    return NextResponse.json(newCust, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
