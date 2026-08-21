import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";

export async function GET() {
  const db = readDb();

  const revenueTotal = db.invoices.reduce((sum: number, inv: any) => (inv.status === "Paid" ? sum + inv.total : sum), 0);
  const bookingsCount = db.bookings.length;
  const completedCount = db.bookings.filter((b: any) => b.status === "Completed").length;

  const mechanicWorkloads = db.mechanics.map((m: any) => {
    const jobs = db.bookings.filter((b: any) => b.mechanicId === m.id);
    return {
      name: m.name,
      rating: m.rating,
      completed: jobs.filter((j: any) => j.status === "Completed").length,
      current: jobs.filter((j: any) => j.status === "In Progress" || j.status === "Inspection").length,
    };
  });

  const customerCount = db.customers.length;
  const vehicleCount = db.vehicles.length;

  return NextResponse.json({
    summary: {
      revenueTotal,
      bookingsCount,
      completedCount,
      customerCount,
      vehicleCount,
    },
    mechanicWorkloads,
    monthlyServiceTrends: [
      { month: "Jan", revenue: 4500, bookings: 32 },
      { month: "Feb", revenue: 5200, bookings: 38 },
      { month: "Mar", revenue: 7800, bookings: 55 },
      { month: "Apr", revenue: 6100, bookings: 44 },
      { month: "May", revenue: 9400, bookings: 68 },
      { month: "Jun", revenue: 12500, bookings: 82 },
      { month: "Jul", revenue: 15400, bookings: 95 },
    ],
    topServices: [
      { name: "Brake Service", value: 38 },
      { name: "Oil Change", value: 45 },
      { name: "EV Powertrain Scan", value: 12 },
      { name: "Suspension Repair", value: 25 },
      { name: "A/C Recharging", value: 18 },
    ],
  });
}
