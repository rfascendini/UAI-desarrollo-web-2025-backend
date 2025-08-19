// src/index.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// src/libs/mongodb.ts
import mongoose from "mongoose";
async function connectToMongoDB() {
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

// src/index.ts
dotenv.config();
var app = express();
app.use(cors());
app.use(express.json());
var PORT = process.env.PORT || 3e3;
connectToMongoDB();
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map