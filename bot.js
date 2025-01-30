const TelegramBot = require("node-telegram-bot-api");
const mongoose = require("mongoose");
const { BOT_TOKEN, MONGO_URI } = require("./config");
const User = require("./models/userModel");
const Chat = require("./models/chatModel");
const { getGeminiResponse } = require("./services/geminiService");

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Handle user registration
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
        keyboard: [[{ text: "📱 Share Contact", request_contact: true }]],
        one_time_keyboard: true,
      },
    });
  } else {
    bot.sendMessage(chatId, "Welcome back! You can now chat with Gemini AI.");
  }
});

// Store phone number and enable AI chat
bot.on("contact", async (msg) => {
  const chatId = msg.chat.id;
  const phoneNumber = msg.contact.phone_number;

  await User.updateOne({ chatId }, { phoneNumber });
  bot.sendMessage(
    chatId,
    "✅ Phone number saved! You can now chat with Gemini AI. Just send a message."
  );
});

// Handle user messages and use Gemini AI
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Ignore messages that are not text (e.g., contacts, images)
  if (!text) return;

  const user = await User.findOne({ chatId });
  if (!user || !user.phoneNumber) {
    return bot.sendMessage(
      chatId,
      "❌ Please share your phone number first by using /start."
    );
  }

  const response = await getGeminiResponse(text);

  const newChat = new Chat({
    chatId,
    userMessage: text,
    botResponse: response,
  });
  await newChat.save();

  bot.sendMessage(chatId, `🤖 ${response}`);
});

console.log("🤖 Bot is running...");
