import { NextRequest, NextResponse } from "next/server";
import { readDb, logAudit } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const db = readDb();
    const user = db.users.find((u: any) => u.email.toLowerCase() === (email || "").toLowerCase());

    if (
      user &&
      (password === "admin123" ||
        password === "manager123" ||
        password === "advisor123" ||
        password === "mechanic123" ||
        password === user.passwordHash)
    ) {
      logAudit("Login", `User logged in`, user);
      return NextResponse.json({
        success: true,
        token: "jwt-token-apex-crm-" + Date.now(),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          status: user.status,
          branchId: user.branchId,
          twoFactorEnabled: user.twoFactorEnabled,
        },
      });
    }

    return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
