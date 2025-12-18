export async function execute(client, channel, tags, args) {
  if (args.length < 2) {
    client.say(channel, "Usage: !timeout <username> <duration>");
    return;
  }

  const [username, duration] = args;
  const parsedDuration = parseInt(duration, 10);

  // Check if user is a mod, VIP, or streamer
  const isAllowed =
    tags.badges?.broadcaster || // Streamer
    tags.badges?.moderator || // Moderator
    tags.badges?.vip; // VIP

  if (!isAllowed) {
    client.say(
      channel,
      "❌ You must be a streamer, mod, or VIP to use this command."
    );
    return;
  }

  try {
    await client.timeout(
      channel,
      username,
      parsedDuration,
      "Timed out by bot command"
    );
    client.say(
      channel,
      `⏳ ${username} has been timed out for ${parsedDuration} seconds.`
    );
  } catch (error) {
    console.error(`❌ Error timing out ${username}: ${error.message}`);
    client.say(
      channel,
      "⚠️ Unable to timeout user. Check permissions or try again."
    );
  }
}
