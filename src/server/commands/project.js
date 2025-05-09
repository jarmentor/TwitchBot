import axios from "axios";

export async function execute(client, channel) {
  try {
    const response = await axios.get("http://localhost:3001/api/project");
    const { description, updatedAt } = response.data;

    if (!description) {
      client.say(channel, "No active project is set.");
      return;
    }

    const lastUpdated = new Date(updatedAt).toLocaleString();
    client.say(channel, `📌 Current Project: ${description} (Last updated: ${lastUpdated})`);
  } catch (error) {
    console.error("❌ Error fetching project:", error.message);
    client.say(channel, "⚠️ Unable to retrieve project info.");
  }
}
