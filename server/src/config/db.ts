import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const connStr = process.env.MONGODB_URI || "";
    if (!connStr) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    const conn = await mongoose.connect(connStr);
    isConnected = true;
    console.log(`[MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error("[MongoDB] Connection Error:", error);
  }
};

