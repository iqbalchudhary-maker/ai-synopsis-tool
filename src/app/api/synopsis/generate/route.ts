import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" } 
    });

    const prompt = `
      Generate a FRESH and UNIQUE professional synopsis for: ${body.title_name}. 
      CAST: ${body.cast || "N/A"}
      DIRECTOR: ${body.director || "N/A"}
      SOURCE CONTEXT: ${body.source_synopsis}

      Return EXACTLY this JSON structure:
      {
        "short": "string",
        "medium": "string",
        "long": "string"
      }
    `;

    const result = await model.generateContent(prompt);
    // Yahan .text() use karna zaroori hai
    const responseText = result.response.text();
    
    // JSON parse karne se pehle safety check
    const parsedData = JSON.parse(responseText);
    
    return NextResponse.json({ data: parsedData });

  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate synopsis" }, 
      { status: 500 }
    );
  }
}