import express from "express";
import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Only initialize Discord strategy if credentials are configured
if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET) {
  passport.use(
    new DiscordStrategy(
      {
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: "http://localhost:3001/api/discord/auth/callback",
        scope: ["identify", "email", "guilds"],
      },
      (accessToken, refreshToken, profile, done) => {
        done(null, { profile, accessToken });
      }
    )
  );
}

router.get("/auth", passport.authenticate("discord"));

router.get(
  "/auth/callback",
  passport.authenticate("discord", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard"); // Redirect after login
  }
);

export default router;
