import mongoose, { Schema, Document } from "mongoose";

export interface ICustomerNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface ICustomerDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
  uploadedAt: string;
}

export interface ICustomer extends Document {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  loyaltyPoints: number;
  tags: string[];
  group: string;
  notes: ICustomerNote[];
  documents: ICustomerDocument[];
  createdAt?: string;
}

const CustomerSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    status: { type: String, default: "Active" },
    loyaltyPoints: { type: Number, default: 0 },
    tags: [{ type: String }],
    group: { type: String, default: "Retail" },
    notes: [
      {
        id: { type: String },
        author: { type: String },
        text: { type: String },
        createdAt: { type: String },
      },
    ],
    documents: [
      {
        id: { type: String },
        name: { type: String },
        type: { type: String },
        size: { type: String },
        url: { type: String },
        uploadedAt: { type: String },
      },
    ],
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export default mongoose.model<ICustomer>("Customer", CustomerSchema);
