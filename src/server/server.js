import dotenv from "dotenv";
import passport from "passport";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js"; // Separate user handling into its own file
import twitchRoutes from "./routes/twitchRoutes.js";
import discordRoutes from "./routes/discordRoutes.js"; // Future Twitch API handling
import tmi from "tmi.js";
import commands from "./commands/index.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session())

const mongoURI = process.env.NODE_ENV === "test"
  ? process.env.MONGO_TEST_URI
  : process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB();

const client = new tmi.Client({
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: `oauth:${process.env.TWITCH_BOT_OAUTH_TOKEN}`,
  },
  channels: [process.env.TWITCH_CHANNEL_NAME],
});

client.connect();

client.on("message", (channel, tags, message, self) => {
  if (self) return;
  if (!message.startsWith("!")) return;

  const args = message.slice(1).split(" ");
  const commandName = args.shift().toLowerCase();

  try {
    if (commands[commandName]) {
      commands[commandName].execute(client, channel, tags, args);
    } else {
      client.say(channel, `Unknown command: ${commandName}`);
    }
  } catch (error) {
    console.error(`Error executing command "${commandName}":`, error);
  }
});

client.on("connected", (addr, port) => {
  console.log(`✅ Connected to Twitch chat on ${addr}:${port}`);
});

client.on("disconnected", (reason) => {
  console.error(`❌ Disconnected from Twitch chat: ${reason}`);
  client.connect();
});

// Basic Routes
app.use("/api/users", userRoutes);
app.use("/api/discord", discordRoutes);
app.use("/api/twitch", twitchRoutes);

app.get("/", (_, res) => res.send("🚀 Server is running!"));

// Server Initialization
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

export default app;
