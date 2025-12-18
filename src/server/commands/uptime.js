import axios from "axios";

const CLIENT_ID = process.env.TWITCH_CLIENT_ID; // Load Twitch Client ID from .env
const OAUTH_TOKEN = process.env.TWITCH_BOT_OAUTH_TOKEN; // Load OAuth Token from .env

export async function execute(client, channel) {
  try {
    const response = await axios.get(
      `https://api.twitch.tv/helix/streams?user_login=${channel}`,
      {
        headers: {
          "Client-ID": CLIENT_ID,
          Authorization: `Bearer ${OAUTH_TOKEN}`,
        },
      }
    );

    const stream = response.data.data[0];

    if (stream) {
      const startedAt = new Date(stream.started_at);
      const uptime = Math.floor((Date.now() - startedAt) / 60000);
      client.say(channel, `⏳ Stream has been live for ${uptime} minutes.`);
    } else {
      client.say(channel, "🔴 Stream is not live.");
    }
  } catch (error) {
    console.error(`❌ Error fetching stream uptime: ${error.message}`);
    client.say(
      channel,
      "⚠️ Unable to retrieve stream uptime. Try again later."
    );
  }
}
