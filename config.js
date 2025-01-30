require("dotenv").config();

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN, // Telegram bot token
  MONGO_URI: process.env.MONGO_URI, // MongoDB URI
  GEMINI_API_KEY: process.env.GEMINI_API_KEY, // Google Gemini API key
};
