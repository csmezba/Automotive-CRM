import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  avatar?: string;
  status: string;
  branchId?: string;
  twoFactorEnabled?: boolean;
}

const UserSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, default: "Service Advisor" },
    avatar: { type: String, default: "" },
    status: { type: String, default: "Active" },
    branchId: { type: String, default: "BR-1" },
    twoFactorEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
