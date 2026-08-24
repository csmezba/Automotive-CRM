import mongoose, { Schema, Document } from "mongoose";

export interface IMechanic extends Document {
  id: string;
  name: string;
  email: string;
  skills: string[];
  status: string;
  rating: number;
  completedJobs: number;
  workingHours: string;
  currentBookingId?: string;
  attendanceStatus: string;
  efficiencyScore: number;
  activeJobsCount: number;
}

const MechanicSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, default: "" },
    skills: [{ type: String }],
    status: { type: String, default: "Available" },
    rating: { type: Number, default: 5.0 },
    completedJobs: { type: Number, default: 0 },
    workingHours: { type: String, default: "08:00 - 17:00" },
    currentBookingId: { type: String },
    attendanceStatus: { type: String, default: "Present" },
    efficiencyScore: { type: Number, default: 95 },
    activeJobsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IMechanic>("Mechanic", MechanicSchema);
