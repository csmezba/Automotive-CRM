import { NextRequest, NextResponse } from "next/server";
import { readDb, saveDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const brand = searchParams.get("brand");
  const status = searchParams.get("status");

  const db = readDb();
  let result = [...db.vehicles];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (v: any) =>
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.licensePlate.toLowerCase().includes(q) ||
        v.vin.toLowerCase().includes(q)
    );
  }
  if (brand) {
    result = result.filter((v: any) => v.brand.toLowerCase() === brand.toLowerCase());
  }
  if (status) {
    result = result.filter((v: any) => v.status === status);
  }

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = readDb();
    const newVeh = {
      id: `VEH-${Date.now()}`,
      customerId: body.customerId,
      customerName: body.customerName || "Walk-In Customer",
      vin: body.vin,
      engineNumber: body.engineNumber || "",
      licensePlate: body.licensePlate,
      brand: body.brand,
      model: body.model,
      variant: body.variant || "",
      year: Number(body.year) || 2024,
      color: body.color || "",
      fuelType: body.fuelType || "Petrol",
      transmission: body.transmission || "Automatic",
      mileage: Number(body.mileage) || 0,
      insuranceExpiry: body.insuranceExpiry || "",
      warrantyExpiry: body.warrantyExpiry || "",
      status: body.status || "Pending",
      images: body.images || ["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&h=250&q=80"],
      accidentHistory: body.accidentHistory || [],
    };
    db.vehicles.unshift(newVeh);
    saveDb(db);
    return NextResponse.json(newVeh, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
