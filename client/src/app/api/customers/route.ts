import { NextRequest, NextResponse } from "next/server";
import { readDb, saveDb, logAudit } from "@/lib/db";

const EXPRESS_URL = process.env.EXPRESS_BACKEND_URL || "http://localhost:5000";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const expressRes = await fetch(`${EXPRESS_URL}/api/customers${url.search}`);
    if (expressRes.ok) {
      const data = await expressRes.json();
      return NextResponse.json(data);
    }
  } catch (e) {
    console.warn("[Next API Proxy] Express fetch failed, falling back to local db:", e);
  }

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

    try {
      const expressRes = await fetch(`${EXPRESS_URL}/api/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (expressRes.ok) {
        const data = await expressRes.json();
        return NextResponse.json(data, { status: 201 });
      }
    } catch (e) {
      console.warn("[Next API Proxy] Express POST failed, falling back:", e);
    }

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
