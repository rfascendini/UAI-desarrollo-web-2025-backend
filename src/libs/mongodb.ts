import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectToMongoDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGODB_CONNECTION_STRING;

  if (!uri) {
    throw new Error("Falta MONGODB_URI en el entorno.");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB_NAME || "uai_dw_tp_2025",
    });
  }

  return connectionPromise;
}
