import mongoose, { Schema, Document } from "mongoose";

export interface IClaim {
  id: string;
  warrantyId: string;
  customerName: string;
  vehicleName: string;
  description: string;
  status: string;
  estimatedCost: number;
  createdAt: string;
}

export interface IWarranty extends Document {
  id: string;
  vehicleId: string;
  vehicleName: string;
  customerName: string;
  coverageType: string;
  startDate: string;
  endDate: string;
  status: string;
  partsCovered: string[];
  laborCovered: boolean;
  claims?: IClaim[];
}

const WarrantySchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    vehicleId: { type: String, required: true },
    vehicleName: { type: String, default: "" },
    customerName: { type: String, default: "" },
    coverageType: { type: String, default: "Standard" },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    status: { type: String, default: "Active" },
    partsCovered: [{ type: String }],
    laborCovered: { type: Boolean, default: true },
    claims: [
      {
        id: { type: String },
        warrantyId: { type: String },
        customerName: { type: String },
        vehicleName: { type: String },
        description: { type: String },
        status: { type: String, default: "Pending" },
        estimatedCost: { type: Number, default: 0 },
        createdAt: { type: String, default: () => new Date().toISOString() },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IWarranty>("Warranty", WarrantySchema);
