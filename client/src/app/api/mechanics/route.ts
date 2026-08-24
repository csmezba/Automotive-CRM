import { NextRequest, NextResponse } from "next/server";

const EXPRESS_URL = process.env.EXPRESS_BACKEND_URL || "http://localhost:5000";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const expressRes = await fetch(`${EXPRESS_URL}/api/mechanics${url.search}`, { cache: "no-store" });
    if (expressRes.ok) {
      const data = await expressRes.json();
      return NextResponse.json(data);
    }
    return NextResponse.json({ error: "Failed to fetch mechanics from Express" }, { status: expressRes.status });
  } catch (e: any) {
    return NextResponse.json({ error: `Backend connection error: ${e.message}` }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const expressRes = await fetch(`${EXPRESS_URL}/api/mechanics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (expressRes.ok) {
      const data = await expressRes.json();
      return NextResponse.json(data, { status: 201 });
    }
    const errData = await expressRes.json().catch(() => ({}));
    return NextResponse.json(errData, { status: expressRes.status });
  } catch (e: any) {
    return NextResponse.json({ error: `Backend connection error: ${e.message}` }, { status: 502 });
  }
}
