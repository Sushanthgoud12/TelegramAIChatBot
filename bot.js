const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const { BOT_TOKEN, MONGO_URI } = require("./config");
const User = require("./models/userModel");
const Chat = require("./models/chatModel");
const { getGeminiResponse } = require("./services/geminiService");

// MongoDB connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(" Connected to MongoDB"))
  .catch((err) => console.error(" MongoDB Connection Error:", err));

// Create bot in webhook mode
const bot = new TelegramBot(BOT_TOKEN, { polling: false });

// Express app for Render
const app = express();
app.use(bodyParser.json());

// Telegram webhook endpoint
app.post(`/bot${BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Handle /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const user = await User.findOne({ chatId });

  if (!user) {
    const newUser = new User({
      firstName: msg.chat.first_name,
      username: msg.chat.username,
      chatId: chatId,
    });
    await newUser.save();
    bot.sendMessage(chatId, "Welcome! Please share your phone number.", {
      reply_markup: {
        keyboard: [[{ text: " Share Contact", request_contact: true }]],
        one_time_keyboard: true,
      },
    });
  } else {
    bot.sendMessage(chatId, "Welcome back! You can now chat with Gemini AI.");
  }
});

// Store phone number
bot.on("contact", async (msg) => {
  const chatId = msg.chat.id;
  const phoneNumber = msg.contact.phone_number;

  await User.updateOne({ chatId }, { phoneNumber });
  bot.sendMessage(
    chatId,
    " Phone number saved! You can now chat with Gemini AI. Just send a message."
  );
});

// Handle messages
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  const user = await User.findOne({ chatId });
  if (!user || !user.phoneNumber) {
    return bot.sendMessage(
      chatId,
      " Please share your phone number first by using /start."
    );
  }

  // Avoid duplicate messages
  if (user.lastMessage === text) {
    return bot.sendMessage(chatId, " You already sent this message.");
  }

  await User.updateOne({ chatId }, { lastMessage: text });

  const response = await getGeminiResponse(text);

  const newChat = new Chat({
    chatId,
    userMessage: text,
    botResponse: response,
  });
  await newChat.save();

  bot.sendMessage(chatId, ` ${response}`);
});

// Start express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
