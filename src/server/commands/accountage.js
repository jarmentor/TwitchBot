export async function execute(client, channel, userstate) {
  // Retrieve account creation date using Twitch API
  // (You'll need to fetch this using Twitch's Helix API)
  const accountCreationDate = "2018-01-01"; // Replace with actual API result
  const username = userstate.username;

  client.say(
    channel,
    `${username}'s account was created on ${accountCreationDate}.`
  );
}
