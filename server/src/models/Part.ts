import mongoose, { Schema, Document } from "mongoose";

export interface IPart extends Document {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  purchasePrice: number;
  sellingPrice: number;
  supplier: string;
  warehouseLocation: string;
  compatibleVehicles: string[];
}

const PartSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    category: { type: String, default: "General" },
    stock: { type: Number, default: 0 },
    minStock: { type: Number, default: 5 },
    purchasePrice: { type: Number, default: 0 },
    sellingPrice: { type: Number, default: 0 },
    supplier: { type: String, default: "" },
    warehouseLocation: { type: String, default: "" },
    compatibleVehicles: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model<IPart>("Part", PartSchema);
