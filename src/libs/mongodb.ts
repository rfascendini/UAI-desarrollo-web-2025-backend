import mongoose from "mongoose";

/*
 * Este archivo se encarga de conectar a la base de datos MongoDB.
 */
export async function connectToMongoDB() {
    const uri = process.env.MONGODB_CONNECTION_STRING;

    if (!uri) {
        throw new Error(
            "Database environment variables are not set. Please set it in your .env file or environment variables."
        );
    }

    try {
        mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
    }
}
