// services/aiService.ts
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const getTravelAssistantResponse = async (userPrompt: string, history: any[]) => {
  if (!API_KEY) return "API Key is missing in your .env file.";

  // Using the stable Flash model
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
      parts: [{ text: `Context: You are 'UdaanSathi AI', a helpful travel assistant for an Indian flight booking app. Be concise, friendly, and helpful. Question: ${userPrompt}` }]
    });

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();

    if (data.error) {
      console.error("Gemini API Error:", data.error);
      if (data.error.code === 404) {
        return "System Update Required: The AI model is being updated. Please try again later.";
      }
      return `AI Error: ${data.error.message}`;
    }

    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error("Fetch Error:", error);
    return "I'm having trouble connecting. Please check your internet.";
  }
};
