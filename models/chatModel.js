const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  chatId: Number,
  userMessage: String,
  botResponse: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Chat", chatSchema);
