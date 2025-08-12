const axios = require("axios");
const { GEMINI_API_KEY } = require("../config");

async function getGeminiResponse(userInput) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const requestData = {
      contents: [
        {
          parts: [{ text: userInput }]
        }
      ]
    };

    const response = await axios.post(url, requestData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("🔹 Gemini API Response:", response.data);

    if (response.data && response.data.candidates) {
      return response.data.candidates[0]?.content?.parts[0]?.text || "🤖 No response generated.";
    } else {
      throw new Error("Invalid API Response Format");
    }
  } catch (error) {
    console.error(" Gemini API Error:", error.response?.data || error.message);
    return " Error: Could not process your request. Please try again later.";
  }
}

module.exports = { getGeminiResponse };
