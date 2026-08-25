import { NextRequest, NextResponse } from "next/server";

const EXPRESS_URL = process.env.NEXT_PUBLIC_API_URL || process.env.EXPRESS_BACKEND_URL || "http://localhost:5000";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const expressRes = await fetch(`${EXPRESS_URL}/api/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (expressRes.ok) {
      const data = await expressRes.json();
      return NextResponse.json(data);
    }
    const errData = await expressRes.json().catch(() => ({}));
    return NextResponse.json(errData, { status: expressRes.status });
  } catch (e: any) {
    return NextResponse.json({ error: `Backend connection error: ${e.message}` }, { status: 502 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const expressRes = await fetch(`${EXPRESS_URL}/api/bookings/${id}`, {
      method: "DELETE",
    });
    if (expressRes.ok) {
      const data = await expressRes.json();
      return NextResponse.json(data);
    }
    return NextResponse.json({ error: "Failed to delete booking" }, { status: expressRes.status });
  } catch (e: any) {
    return NextResponse.json({ error: `Backend connection error: ${e.message}` }, { status: 502 });
  }
}
