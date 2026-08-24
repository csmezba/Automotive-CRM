import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
  id: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  target: string;
  timestamp: string;
  ipAddress: string;
}

const AuditLogSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    role: { type: String, default: "System" },
    action: { type: String, required: true },
    target: { type: String, required: true },
    timestamp: { type: String, default: () => new Date().toISOString() },
    ipAddress: { type: String, default: "127.0.0.1" },
  },
  { timestamps: true }
);

export default mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
