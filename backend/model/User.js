const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String }, // Field to store the refresh token
});

module.exports = mongoose.model("User", userSchema);
