import tmi from "tmi.js";
import app, { connectDB } from "./app.js";
import commands from "./commands/index.js";

// Connect to database
connectDB().catch((error) => {
  console.error("❌ MongoDB connection error:", error);
  process.exit(1);
});

// Twitch client setup
const client = new tmi.Client({
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: `oauth:${process.env.TWITCH_BOT_OAUTH_TOKEN}`,
  },
  channels: [process.env.TWITCH_CHANNEL_NAME],
});

client.connect();

client.on("message", (channel, tags, message, self) => {
  if (self) {
    return;
  }
  if (!message.startsWith("!")) {
    return;
  }

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
  setTimeout(() => {
    client.connect();
  }, 5000);
});

// Server Initialization
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
