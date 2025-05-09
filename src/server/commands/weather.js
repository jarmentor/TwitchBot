import axios from "axios";

const API_KEY = process.env.OPENWEATHER_API_KEY; // Load API key from .env

export async function execute(client, channel, tags, args) {
  if (args.length === 0) {
    client.say(channel, "Usage: !weather <city>");
    return;
  }

  const city = args.join(" "); // Allow spaces in city names
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;

  try {
    const response = await axios.get(url);
    const { name, main, weather } = response.data;

    const temp = main.temp;
    const condition = weather[0].description;

    client.say(channel, `🌤 Weather in ${name}: ${condition}, ${temp}°C`);
  } catch (error) {
    console.error("❌ Weather API Error:", error.message);
    client.say(channel, "Error retrieving weather data. Make sure the city name is correct.");
  }
}
