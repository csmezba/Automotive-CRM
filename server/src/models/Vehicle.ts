import mongoose, { Schema, Document } from "mongoose";

export interface IAccidentHistory {
  id: string;
  severity: string;
  date: string;
  description: string;
}

export interface IVehicle {
  id: string;
  customerId: string;
  customerName: string;
  vin: string;
  licensePlate: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  color: string;
  fuelType: string;
  transmission: string;
  mileage: number;
  insuranceExpiry: string;
  warrantyExpiry: string;
  status: string;
  images: string[];
  accidentHistory: IAccidentHistory[];
}

export type VehicleDocument = IVehicle & Document;

const VehicleSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    customerId: { type: String, required: true },
    customerName: { type: String, default: "" },
    vin: { type: String, default: "" },
    licensePlate: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    variant: { type: String, default: "" },
    year: { type: Number, default: new Date().getFullYear() },
    color: { type: String, default: "" },
    fuelType: { type: String, default: "Petrol" },
    transmission: { type: String, default: "Automatic" },
    mileage: { type: Number, default: 0 },
    insuranceExpiry: { type: String, default: "" },
    warrantyExpiry: { type: String, default: "" },
    status: { type: String, default: "Registered" },
    images: [{ type: String }],
    accidentHistory: [
      {
        id: { type: String },
        severity: { type: String },
        date: { type: String },
        description: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IVehicle>("Vehicle", VehicleSchema);
