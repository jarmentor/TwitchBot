export function execute(client) {
  client.on("message", (channel, tags, message, self) => {
    if (self) return; // Ignore bot messages

    if (/famous/i.test(message)) {
      const username = tags.username;

      // Attempt to ban the user
      client
        .ban(channel, username, "Automatic ban: Message contained 'famous'")
        .then(() => {
          console.log(`✅ Banned user: ${username} for saying 'famous'`);
        })
        .catch((error) => {
          console.error(`❌ Error banning ${username}: ${error.message}`);
        });
    }
  });
}
