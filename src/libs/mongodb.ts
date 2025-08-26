import mongoose from "mongoose";

export async function connectToMongoDB() {
    const uri = process.env.MONGODB_CONNECTION_STRING;
    const dbName = "uai_dw_tp_2025";

    if (!uri) {
        throw new Error(
            "Database environment variables are not set. Please set it in your .env file or environment variables."
        );
    }

    try {
        mongoose.connect(uri, {dbName});
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
    }
}
