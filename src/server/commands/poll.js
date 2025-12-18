export function execute(client, channel, tags, args) {
  if (args.length < 2) {
    client.say(
      channel,
      "Usage: !poll Question | Option1 | Option2 | Option3..."
    );
    return;
  }

  const pollData = args
    .join(" ")
    .split("|")
    .map((item) => item.trim());

  if (pollData.length < 3) {
    client.say(channel, "Poll must have at least two options!");
    return;
  }

  const question = pollData[0];
  const options = pollData.slice(1);

  let pollMessage = `📊 Poll Started: ${question}\n`;
  options.forEach((option, index) => {
    pollMessage += `[${index + 1}] ${option}\n`;
  });

  client.say(channel, pollMessage);
}
