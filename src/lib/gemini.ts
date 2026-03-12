import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure your GEMINI_API_KEY is in .env
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in environment variables.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use 'gemini-1.5-pro' as per your requirement
export const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });