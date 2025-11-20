import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: "GEMINI_API_KEY not found in environment variables",
      });
    }

    console.log("Testing Gemini API connection...");
    console.log("API Key present:", apiKey ? "Yes" : "No");
    console.log("API Key length:", apiKey.length);
    console.log("API Key starts with:", apiKey.substring(0, 10) + "...");

    // Try direct REST API call first
    const testUrl = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
    console.log("Testing direct API call...");
    
    const listResponse = await fetch(testUrl);
    const listData = await listResponse.json();
    
    if (!listResponse.ok) {
      return NextResponse.json({
        success: false,
        error: "API key might be invalid",
        details: listData,
      });
    }
    
    console.log("Available models:", listData);
    
    // Now try with SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    console.log("Using model: gemini-2.5-pro");

    // Simple test prompt
    const result = await model.generateContent("Say 'Hello, connection successful!' in one sentence.");
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      success: true,
      message: "Gemini API is working correctly",
      testResponse: text,
      apiKeyConfigured: true,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Gemini API test failed:", err);
    
    return NextResponse.json({
      success: false,
      error: err.message,
      errorName: err.name,
      stack: err.stack,
    });
  }
}
