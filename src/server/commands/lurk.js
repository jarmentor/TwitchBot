export async function execute(client, channel, tags) {
  const username = tags.username;
  client.say(channel, `👀 ${username} is now lurking. Enjoy your lurk!`);
}
