import dotenv from "dotenv";
import passport from "passport";
dotenv.config();
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import twitchRoutes from "./routes/twitchRoutes.js";
import discordRoutes from "./routes/discordRoutes.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET_KEY || "dev-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/discord", discordRoutes);
app.use("/api/twitch", twitchRoutes);

app.get("/", (_, res) => res.send("🚀 Server is running!"));

// Error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: err.message });
});

// Database connection helper
export const connectDB = async (uri) => {
  const mongoURI = uri || process.env.MONGO_URI;
  await mongoose.connect(mongoURI);
  console.log("✅ Connected to MongoDB");
};

export const closeDB = async () => {
  await mongoose.connection.close();
};

export default app;
