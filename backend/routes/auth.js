const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const router = express.Router();
const { JWT_SECRET, REFRESH_TOKEN_SECRET } = require("../config");

// Generate Tokens
const generateAccessToken = (userId) => jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "15m" });
const generateRefreshToken = (userId) => jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

// Signin
router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: "User not found" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(401).json({ error: "Invalid credentials" });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.json({ accessToken, refreshToken });
});

// Refresh Token
router.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(403).json({ error: "Refresh token required" });

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user._id);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ error: "Invalid refresh token" });
  }
});
