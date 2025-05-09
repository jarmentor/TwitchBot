import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  twitchId: { type: String, unique: true },
  discordId: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
