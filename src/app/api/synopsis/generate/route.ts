import { NextResponse } from "next/server";
import { generateSynopsis } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // AI se synopsis generate karna (Result ek object hoga: {short, medium, long})
    const aiData = await generateSynopsis(body);
    
    // Debugging: Terminal mein confirm karein ke object structure sahi hai
    console.log("AI Response Object:", JSON.stringify(aiData, null, 2));
    
    // Success Response
    return NextResponse.json({ 
      status: "success", 
      data: aiData 
    });
    
  } catch (error) {
    // Error Logging: Taake pata chale ke kahan issue hai (AI ya Parsing)
    console.error("API_GENERATE_ERROR:", error);
    
    return NextResponse.json(
      { 
        status: "error", 
        error: "Failed to generate synopsis from AI." 
      }, 
      { status: 500 }
    );
  }
}