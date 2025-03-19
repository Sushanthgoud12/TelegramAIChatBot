require("dotenv").config();

// Debug logging
console.log("Checking environment variables...");
console.log("BOT_TOKEN exists:", !!process.env.BOT_TOKEN);
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);

if (!process.env.BOT_TOKEN) {
  console.error("❌ BOT_TOKEN is not set in environment variables!");
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not set in environment variables!");
  process.exit(1);
}

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is not set in environment variables!");
  process.exit(1);
}

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN, // Telegram bot token
  MONGO_URI: process.env.MONGO_URI, // MongoDB URI
  GEMINI_API_KEY: process.env.GEMINI_API_KEY, // Google Gemini API key
};
