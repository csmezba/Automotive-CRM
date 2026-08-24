import mongoose, { Schema, Document } from "mongoose";

export interface IReminder extends Document {
  id: string;
  customerId: string;
  customerName: string;
  type: string;
  dueDate: string;
  status: string;
  channel: string;
}

const ReminderSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    type: { type: String, required: true },
    dueDate: { type: String, required: true },
    status: { type: String, default: "Pending" },
    channel: { type: String, default: "Email" },
  },
  { timestamps: true }
);

export default mongoose.model<IReminder>("Reminder", ReminderSchema);
