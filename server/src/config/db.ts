import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGODB_URI || "";
    const conn = await mongoose.connect(connStr);
    console.log(`[MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error("[MongoDB] Connection Error:", error);
    process.exit(1);
  }
};
