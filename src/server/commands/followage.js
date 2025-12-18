import axios from "axios";

const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const OAUTH_TOKEN = process.env.TWITCH_BOT_OAUTH_TOKEN;

export async function execute(client, channel, tags) {
  const username = tags.username;
  try {
    const response = await axios.get(
      `https://api.twitch.tv/helix/users/follows?to_id=${channel}&from_id=${tags["user-id"]}`,
      {
        headers: {
          "Client-ID": CLIENT_ID,
          Authorization: `Bearer ${OAUTH_TOKEN}`,
        },
      }
    );

    const followData = response.data.data[0];

    if (!followData) {
      client.say(channel, `${username}, you are not following this channel.`);
      return;
    }

    const followDate = new Date(followData.followed_at);
    const duration = Math.floor(
      (Date.now() - followDate) / (1000 * 60 * 60 * 24)
    ); // Convert to days

    client.say(
      channel,
      `${username} has been following ${channel} for ${duration} days.`
    );
  } catch (error) {
    console.error(`❌ Error fetching followage: ${error.message}`);
    client.say(
      channel,
      "⚠️ Unable to retrieve follow duration. Try again later."
    );
  }
}
