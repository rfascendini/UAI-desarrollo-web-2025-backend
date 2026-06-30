import express from "express";
import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectToMongoDB } from "./libs/mongodb";
import router from "./routes";

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Origen no permitido por CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

app.use(async (_req, _res, next) => {
  try {
    await connectToMongoDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.get("/", (_req, res) => {
  res.send("CS1.6 Play API");
});

app.use("/api", router);

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  const message = error.message || "Error interno";
  res.status(500).json({ message });
});

const PORT = process.env.PORT || 3000;

if (process.env.VERCEL !== "1") {
  app.listen(PORT);
}

export default app;
