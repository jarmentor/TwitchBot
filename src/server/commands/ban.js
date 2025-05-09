export async function execute(client, channel, userstate, argument) {
  const username = argument.trim();

  if (!username) {
    client.say(channel, "Please provide a username to ban.");
    return;
  }

  try {
    await client.ban(channel, username, "Banned by bot command");
    client.say(channel, `${username} has been banned.`);
  } catch (error) {
    console.error(`❌ Error banning user: ${error.message}`);
  }
}
