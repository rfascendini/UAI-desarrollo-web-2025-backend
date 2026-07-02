import express from "express";
import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
let routerPromise: Promise<typeof import("./routes/index.js")> | null = null;
let mongoPromise: Promise<typeof import("./libs/mongodb.js")> | null = null;

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin))
        return callback(null, true);
      return callback(new Error("Origen no permitido por CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());

app.get("/system/status", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API funcionando",
  });
});

app.get("/favicon.ico", (_req, res) => {
  res.status(204).end();
});

app.get("/", (_req, res) => {
  res.send("CS1.6 5YA API");
});

app.use(async (_req, _res, next) => {
  try {
    mongoPromise ??= import("./libs/mongodb.js");
    const { connectToMongoDB } = await mongoPromise;
    await connectToMongoDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.use("/api", async (req, res, next) => {
  try {
    routerPromise ??= import("./routes/index.js");
    const { default: router } = await routerPromise;
    router(req, res, next);
  } catch (error) {
    next(error);
  }
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  const message = error.message || "Error interno";
  res.status(500).json({ message });
});

const PORT = process.env.PORT || 3000;

if (process.env.VERCEL !== "1") {
  app.listen(PORT);
}

export default app;
