import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateSynopsis(data: { 
  title: string, 
  cast: string, 
  director: string, 
  source: string 
}) {
  // 1.5-flash ka naya feature: Structured Output (JSON mode)
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" } 
  });

  const prompt = `
    You are a professional metadata editor. 
    Generate 3 synopsis versions for "${data.title}".
    Director: ${data.director}, Cast: ${data.cast}.
    Source: ${data.source}.
    
    STRICT RULES:
    1. Short: < 120 chars.
    2. Medium: < 200 chars.
    3. Long: < 350 chars.
    
    Return ONLY a JSON object: { "short": "...", "medium": "...", "long": "..." }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean and parse
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
    
  } catch (error) {
    console.error("AI_GENERATION_ERROR:", error);
    throw new Error("Failed to generate synopsis from AI.");
  }
}