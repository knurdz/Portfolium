import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: "GEMINI_API_KEY not found",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try to list models
    const models = await genAI.listModels();
    
    return NextResponse.json({
      success: true,
      models: models.map(m => ({
        name: m.name,
        displayName: m.displayName,
        supportedMethods: m.supportedGenerationMethods,
      })),
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({
      success: false,
      error: err.message,
    });
  }
}
