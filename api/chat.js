import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Handle OPTIONS preflight requests
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Replace "*" with your frontend origin in prod
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  // Only allow POST method
  if (req.method !== "POST") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Set CORS headers for actual POST response
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  const prompt = `
You be smart chatbot wey sabi answer health insurance questions in both Nigerian Pidgin and English. Please respond with just either of the two depending on the user's input. If not Pidgin or English, say "[this is not pidgin]".
Be friendly and clear.

User: "${message}"
Bot:
  `;

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const reply = await result.response.text();
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Gemini Error:", error);
    return res.status(500).json({ error: "Gemini API Error", details: error.message });
  }
}
