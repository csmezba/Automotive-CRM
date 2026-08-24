import mongoose, { Schema, Document } from "mongoose";

export interface IChecklistItem {
  id: string;
  item: string;
  checked: boolean;
}

export interface IBooking extends Document {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  vehicleId: string;
  vehicleName: string;
  licensePlate: string;
  mechanicId?: string;
  mechanicName?: string;
  serviceType: string;
  bookingDate: string;
  bookingTime: string;
  status: string;
  estimatedCost: number;
  estimatedTimeHours: number;
  pickupRequired: boolean;
  dropRequired: boolean;
  customerNotes?: string;
  mechanicNotes?: string;
  checklist: IChecklistItem[];
  beforeImages: string[];
  afterImages: string[];
  digitalSignature?: string;
  invoiceId?: string;
}

const BookingSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    customerId: { type: String, required: true },
    customerName: { type: String, default: "" },
    customerPhone: { type: String, default: "" },
    vehicleId: { type: String, required: true },
    vehicleName: { type: String, default: "" },
    licensePlate: { type: String, default: "" },
    mechanicId: { type: String, default: "" },
    mechanicName: { type: String, default: "" },
    serviceType: { type: String, required: true },
    bookingDate: { type: String, required: true },
    bookingTime: { type: String, default: "09:00" },
    status: { type: String, default: "Scheduled" },
    estimatedCost: { type: Number, default: 0 },
    estimatedTimeHours: { type: Number, default: 1 },
    pickupRequired: { type: Boolean, default: false },
    dropRequired: { type: Boolean, default: false },
    customerNotes: { type: String, default: "" },
    mechanicNotes: { type: String, default: "" },
    checklist: [
      {
        id: { type: String },
        item: { type: String },
        checked: { type: Boolean, default: false },
      },
    ],
    beforeImages: [{ type: String }],
    afterImages: [{ type: String }],
    digitalSignature: { type: String, default: "" },
    invoiceId: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>("Booking", BookingSchema);
