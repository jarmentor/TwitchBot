import dotenv from "dotenv";
dotenv.config();
import express from "express";
import passport from "passport";
import { Strategy as TwitchStrategy } from "passport-twitch-new";

const router = express.Router();

passport.use(
  new TwitchStrategy(
    {
      clientID: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/api/twitch/auth/callback",
      scope: ["user:read:email", "chat:read", "chat:edit"],
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, { profile, accessToken });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

router.get("/auth", passport.authenticate("twitch"));

router.get(
  "/auth/callback",
  passport.authenticate("twitch", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard"); // Redirect after login
  }
);

export default router;
