import mongoose, { Schema, Document } from "mongoose";

export interface IInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  type?: string;
  totalPrice?: number;
}

export interface IInvoice extends Document {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  vehicleId?: string;
  vehicleName: string;
  licensePlate?: string;
  items: IInvoiceItem[];
  subtotal: number;
  taxRate?: number;
  tax?: number;
  discountAmount?: number;
  discount?: number;
  couponCode?: string;
  total: number;
  totalAmount?: number;
  status: string;
  paymentMethod: string;
  paymentDate?: string;
  dueDate?: string;
  createdAt?: string;
}

const InvoiceSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    bookingId: { type: String, required: true },
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, default: "" },
    customerPhone: { type: String, default: "" },
    vehicleId: { type: String, default: "" },
    vehicleName: { type: String, default: "" },
    licensePlate: { type: String, default: "" },
    items: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        unitPrice: { type: Number, default: 0 },
        type: { type: String, default: "Part" },
        totalPrice: { type: Number, default: 0 },
      },
    ],
    subtotal: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0.15 },
    tax: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    couponCode: { type: String, default: "" },
    total: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    status: { type: String, default: "Unpaid" },
    paymentMethod: { type: String, default: "Credit Card" },
    paymentDate: { type: String, default: "" },
    dueDate: { type: String, default: "" },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export default mongoose.model<IInvoice>("Invoice", InvoiceSchema);
