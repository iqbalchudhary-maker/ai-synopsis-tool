import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { short, medium, long, target_language } = await req.json();
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" } 
    });

    const prompt = `
      Translate these 3 synopses into ${target_language}.
      Return ONLY a JSON object:
      {
        "short": "translated short",
        "medium": "translated medium",
        "long": "translated long"
      }
      
      Originals:
      Short: "${short}"
      Medium: "${medium}"
      Long: "${long}"
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    return NextResponse.json({ error: "Translation Failed" }, { status: 500 });
  }
}