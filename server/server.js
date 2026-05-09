import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./configs/db.js";
import authRoutes from "./routes/authRoutes.js";

import identifyRoutes from "./routes/identifyRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ── Kết nối DB ────────────────────────────────────────────────────────
connectDB();

// ── Middlewares ───────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // cho phép gửi cookie
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Routes ────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);

app.use("/api/identify", identifyRoutes);
app.use("/api/history", historyRoutes);

// Health check
app.get("/", (req, res) => res.json({ message: "🌿 Species API is running" }));

// ── Start ─────────────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
