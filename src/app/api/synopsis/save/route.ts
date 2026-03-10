import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Database Insertion (All fields as per requirement)
    const record = await prisma.synopsisGeneration.create({
      data: {
        title_id: data.title_id || "N/A",
        title_name: data.title_name || "Untitled",
        cast: data.cast || "",
        director: data.director || "",
        source_synopsis: data.source_synopsis || "",
        short_synopsis: (data.short || "").substring(0, 120),
        medium_synopsis: (data.medium || "").substring(0, 200),
        long_synopsis: (data.long || "").substring(0, 350),
        
        // Translated fields
        translated_short_synopsis: (data.translated_short || "").substring(0, 120),
        translated_medium_synopsis: (data.translated_medium || "").substring(0, 200),
        translated_long_synopsis: (data.translated_long || "").substring(0, 350),
        
        language_code: data.language_code || "en",
        created_by: "user_admin",
        updated_by: "user_admin"
      }
    });

    return NextResponse.json({ status: "success", id: record.id });
  } catch (error: any) {
    console.error("SAVE_ERROR:", error);
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}