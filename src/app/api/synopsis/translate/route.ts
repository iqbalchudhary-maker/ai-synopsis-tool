import { NextResponse } from 'next/server';
import { geminiModel } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { text, target_language } = await req.json();

    // Section 7.4: Translation Validation
    if (!text || !target_language) {
      return NextResponse.json({ error: "Text and Language are required" }, { status: 400 });
    }

    // Section 10.1 & 10.2: Translation logic (Strict Prompt)
    const prompt = `Translate this text to ${target_language}.
    IMPORTANT: Return ONLY the translated string. Do not include any headers, labels, or original text.
    Text: "${text}"`;

    const result = await geminiModel.generateContent(prompt);
    
    // Safety check: response.text() ko verify karna zaroori hai
    const response = await result.response;
    const translated_text = response.text ? response.text().trim() : "";

    if (!translated_text) {
      throw new Error("AI returned an empty response");
    }

    return NextResponse.json({ translated_text });
  } catch (error) {
    console.error("Translation Error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}