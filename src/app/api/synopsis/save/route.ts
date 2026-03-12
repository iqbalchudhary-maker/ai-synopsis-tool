import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // DEBUG: Terminal mein check karein kya data aa raha hai
    console.log("DEBUG: Received Body Payload:", JSON.stringify(body, null, 2));

    // 7.1 Mandatory Fields Validation
    if (!body.title_name || !body.source_synopsis) {
      console.error("DEBUG: Validation Failed - Missing title_name or source_synopsis");
      return NextResponse.json(
        { status: "error", message: "Title Name and Source Synopsis are required." },
        { status: 400 }
      );
    }

    // Database Operation
    const savedRecord = await prisma.synopsis.create({
      data: {
        title_id: body.title_id || "T000", // Default if missing
        title_name: body.title_name,
        cast: body.cast || null,
        director: body.director || null,
        source_synopsis: body.source_synopsis,
        short_synopsis: body.short_synopsis || "",
        medium_synopsis: body.medium_synopsis || "",
        long_synopsis: body.long_synopsis || "",
        language_code: body.language_code || "en",
        translated_short_synopsis: body.translated_short_synopsis || null,
        translated_medium_synopsis: body.translated_medium_synopsis || null,
        translated_long_synopsis: body.translated_long_synopsis || null,
        created_by: body.created_by || "tanvir",
        updated_by: body.created_by || "tanvir",
        version: 1
      },
    });

    console.log("DEBUG: Successfully saved to database ID:", savedRecord.id);

    return NextResponse.json({ 
      status: "success", 
      message: "Synopsis saved successfully!",
      data: savedRecord 
    });

  } catch (error) {
    // Ye catch block batayega agar database mein constraint violation hai
    console.error("Save Error Details:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to save to database." }, 
      { status: 500 }
    );
  }
}