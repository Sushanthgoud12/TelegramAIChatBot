const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  username: String,
  chatId: Number,
  phoneNumber: String,
});

module.exports = mongoose.model("User", userSchema);
