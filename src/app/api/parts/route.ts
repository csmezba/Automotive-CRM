import { NextRequest, NextResponse } from "next/server";
import { readDb, saveDb } from "@/lib/db";

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.parts);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = readDb();
    const newPart = {
      id: `PART-${db.parts.length + 1}`,
      name: body.name,
      sku: body.sku,
      category: body.category || "Engine",
      stock: Number(body.stock) || 0,
      minStock: Number(body.minStock) || 5,
      purchasePrice: Number(body.purchasePrice) || 0,
      sellingPrice: Number(body.sellingPrice) || 0,
      supplier: body.supplier || "OEM Direct",
      warehouseLocation: body.warehouseLocation || "Aisle 1",
      compatibleVehicles: body.compatibleVehicles || [],
      qrCode: `QR-SKU-${body.sku}`,
    };
    db.parts.unshift(newPart);
    saveDb(db);
    return NextResponse.json(newPart, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
