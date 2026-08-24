import { Request, Response } from "express";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.passwordHash !== password) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    await AuditLog.create({
      id: `AUD-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      role: user.role,
      action: "User Login",
      target: `User ${user.email} logged in`,
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      status: user.status,
      branchId: user.branchId,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
