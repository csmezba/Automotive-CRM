import { NextResponse } from "next/server";

const EXPRESS_URL = process.env.NEXT_PUBLIC_API_URL || process.env.EXPRESS_BACKEND_URL || "http://localhost:5000";

export async function GET() {
  try {
    const expressRes = await fetch(`${EXPRESS_URL}/api/dashboard/stats`, { cache: "no-store" });
    if (expressRes.ok) {
      const data = await expressRes.json();
      return NextResponse.json(data);
    }
    const errText = await expressRes.text();
    return NextResponse.json({ error: `Backend error: ${errText}` }, { status: expressRes.status });
  } catch (e: any) {
    return NextResponse.json({ error: `Express backend unreachable: ${e.message}` }, { status: 502 });
  }
}
