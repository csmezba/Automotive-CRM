import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  read: boolean;
}

const NotificationSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, default: "info" },
    createdAt: { type: String, default: () => new Date().toISOString() },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>("Notification", NotificationSchema);
