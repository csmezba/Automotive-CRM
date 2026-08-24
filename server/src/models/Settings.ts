import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  companyName: string;
  taxRate: number;
  currency: string;
  workingHoursStart: string;
  workingHoursEnd: string;
  aiAutoAnalyze: boolean;
  smsEnabled: boolean;
  emailEnabled: boolean;
}

const SettingsSchema: Schema = new Schema(
  {
    companyName: { type: String, default: "Apex Auto Care" },
    taxRate: { type: Number, default: 0.15 },
    currency: { type: String, default: "USD" },
    workingHoursStart: { type: String, default: "08:00" },
    workingHoursEnd: { type: String, default: "18:00" },
    aiAutoAnalyze: { type: Boolean, default: true },
    smsEnabled: { type: Boolean, default: true },
    emailEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ISettings>("Settings", SettingsSchema);
