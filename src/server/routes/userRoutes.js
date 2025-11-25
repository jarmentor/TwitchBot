import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Assuming a User model exists

const router = express.Router();

// User Registration
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error while registering user" });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

    res.cookie("accessToken", token, { httpOnly: true }).status(200).json(userInfo);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error while logging in" });
  }
});

// User Logout
router.post("/logout", (req, res) => {
  res.clearCookie("accessToken").status(200).json({ message: "Logout successful" });
});

export default router;
