export function execute(client, channel) {
  const responses = [
    "Yes!", "No.", "Maybe.", "Ask again later.", "Definitely!", "I wouldn't count on it.",
    "The stars say yes.", "Not looking good.", "Absolutely.", "Very doubtful."
  ];

  const randomIndex = Math.floor(Math.random() * responses.length);
  const reply = responses[randomIndex];

  client.say(channel, `🎱 Magic 8-Ball says: ${reply}`);
}
