// services/aiService.ts
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const getTravelAssistantResponse = async (userPrompt: string, history: any[]) => {
  if (!API_KEY) return "API Key is missing in your .env file.";

  // UPDATED FOR 2025: Using the new stable Flash model
  // If 'gemini-2.0-flash' doesn't work in your region yet, use 'gemini-2.5-flash'
  const MODEL_NAME = "gemini-2.5-flash-lite";
  const API_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

  try {
    // Format history to match the Google 'contents' structure
    const contents = history
      .filter(m => m.role === "user" || m.role === "model")
      .map(m => ({
        role: m.role === "model" ? "model" : "user",
        parts: [{ text: m.text }]
      }));

    // Add the current prompt if not already in history
    contents.push({
      role: "user",
      parts: [{ text: `Context: You are 'Express AI', a helpful travel assistant. Question: ${userPrompt}` }]
    });

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();

    if (data.error) {
      console.error("Gemini API Error:", data.error);
      // Specific fix if the model is still 'Not Found'
      if (data.error.code === 404) {
        return "System Update Required: Please change MODEL_NAME in aiService.ts to 'gemini-2.5-flash'.";
      }
      return `AI Error: ${data.error.message}`;
    }
    const roboticSystemPrompt = `
  You are AIRCARE BOT v2.0. 
  Your personality: Efficient, precise, and slightly robotic.
  Rules: 
  - Start responses with [PROCESSING] or [LOGIC_UNIT].
  - Use technical terms where possible (e.g., 'Coordinates' instead of 'Location').
  - Keep it very concise and well-formatted.
`;
    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error("Fetch Error:", error);
    return "I'm having trouble connecting. Please check your internet.";
  }
};