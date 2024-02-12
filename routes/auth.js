const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const passport = require('passport');

dotenv.config();

// Route to register a new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the email or username is already registered
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email or username already registered" });
    }

    // Create a new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Generate a JWT token for the newly registered user
    const token = jwt.sign({ userId: newUser.userId }, process.env.JWT_SECRET, {
      expiresIn: "240h",
    });

    res.status(200).json({ message: "Registration successful", token });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to log in a user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate a JWT token for the logged-in user
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: "240h",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // Redirect or respond with a JWT token
  const token = jwt.sign({ userId: req.user.userId }, process.env.JWT_SECRET, { expiresIn: '240h' });
  res.status(200).json({ message: 'Google login successful', token });
});

module.exports = router;
