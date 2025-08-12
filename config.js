require("dotenv").config();

// Debug logging
console.log("=== Environment Variables Debug ===");
console.log("Current working directory:", process.cwd());
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("All environment variables:", Object.keys(process.env));
console.log(
  "BOT_TOKEN length:",
  process.env.BOT_TOKEN ? process.env.BOT_TOKEN.length : 0
);
console.log(
  "MONGO_URI length:",
  process.env.MONGO_URI ? process.env.MONGO_URI.length : 0
);
console.log(
  "GEMINI_API_KEY length:",
  process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0
);

if (!process.env.BOT_TOKEN) {
  console.error(" BOT_TOKEN is not set in environment variables!");
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error(" MONGO_URI is not set in environment variables!");
  process.exit(1);
}

if (!process.env.GEMINI_API_KEY) {
  console.error(" GEMINI_API_KEY is not set in environment variables!");
  process.exit(1);
}

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN, // Telegram bot token
  MONGO_URI: process.env.MONGO_URI, // MongoDB URI
  GEMINI_API_KEY: process.env.GEMINI_API_KEY, // Google Gemini API key
};
