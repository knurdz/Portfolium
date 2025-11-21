import { NextRequest, NextResponse } from "next/server";
import { generateJobId, generationStatus } from "./storage";
import { createAdminClient, DATABASE_ID, JOBS_COLLECTION_ID } from "@/lib/appwrite";

// Fallback function using OpenAI-compatible API (Groq is free and fast)
async function generateWithGroq(userInfo: string) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY not configured");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile", // Free tier available
      messages: [
        {
          role: "system",
          content: "You are a professional portfolio website generator. Create complete HTML portfolios with embedded CSS."
        },
        {
          role: "user",
          content: `Based on the following user information, create a beautiful, modern, and responsive portfolio HTML page.

User Information:
${userInfo.substring(0, 2000)}

Requirements:
1. Create a complete, single-page HTML portfolio with embedded CSS
2. Include sections: Hero/Header, About, Skills, Experience, Education, Projects, Contact
3. Use modern, clean design with a professional color scheme (purple/indigo gradient theme)
4. Make it fully responsive (mobile-friendly)
5. Include smooth animations and transitions
6. Use semantic HTML5 elements
7. Add Font Awesome icons (via CDN) for visual appeal
8. Use Google Fonts for typography
9. Ensure the design is visually appealing and professional
10. Extract and organize all relevant information from the user's data

Return ONLY the complete HTML code, no explanations or markdown code blocks. The HTML should be ready to render directly.`
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Groq API error");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}


export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const details = formData.get("details") as string;
    const cvFile = formData.get("cv") as File | null;
    const selectedModel = formData.get("model") as string || "gemini-2.5-flash";

    let userInfo = details || "";

    // If CV file is provided, extract text from it
    if (cvFile) {
      try {
        const cvText = await cvFile.text();
        userInfo += `\n\nCV Content:\n${cvText}`;
      } catch (fileError) {
        console.error("Error reading CV file:", fileError);
        return NextResponse.json(
          { error: "Failed to read CV file. Please try a different format." },
          { status: 400 }
        );
      }
    }

    if (!userInfo.trim()) {
      return NextResponse.json(
        { error: "Please provide details or upload a CV" },
        { status: 400 }
      );
    }

    // Generate job ID for async processing
    const jobId = generateJobId();
    
    // Initialize job status in database (with fallback to in-memory)
    let useDatabase = true;
    try {
      const { databases } = await createAdminClient();
      await databases.createDocument(
        DATABASE_ID,
        JOBS_COLLECTION_ID,
        jobId,
        {
          status: 'processing',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      );
      console.log(`[${jobId}] Job created in database`);
    } catch (dbError: unknown) {
      console.warn(`[${jobId}] Database unavailable, using in-memory storage:`, (dbError as Error).message);
      // Fallback to in-memory storage if database collection doesn't exist
      useDatabase = false;
      generationStatus.set(jobId, { status: 'processing' });
      console.log(`[${jobId}] Job created in memory (fallback)`);
      console.log(`[${jobId}] In-memory jobs after creation:`, Array.from(generationStatus.keys()));
    }
    
    // Start async generation (don't await)
    generatePortfolioAsync(jobId, userInfo, selectedModel, useDatabase);

    // Return job ID immediately
    return NextResponse.json({ 
      jobId,
      message: "Portfolio generation started. Poll /api/generate-portfolio/status?jobId=" + jobId
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error starting portfolio generation:", err);
    return NextResponse.json(
      { error: "Failed to start portfolio generation", details: err.message },
      { status: 500 }
    );
  }
}

// Async generation function
async function generatePortfolioAsync(jobId: string, userInfo: string, selectedModel: string, useDatabase: boolean = true) {
  console.log(`[${jobId}] Starting portfolio generation with Groq using ${useDatabase ? 'database' : 'in-memory'} storage...`);
  
  try {
    let portfolio = "";
    let usedProvider = "";

    // Use Groq for generation
    try {
      console.log(`[${jobId}] Using Groq Llama 3.3 70B...`);
      portfolio = await generateWithGroq(userInfo);
      usedProvider = "Groq Llama 3.3 70B";
      console.log(`[${jobId}] Portfolio generated successfully with Groq, length:`, portfolio.length);
    } catch (groqError) {
      console.error(`[${jobId}] Groq failed:`, (groqError as Error).message);
      throw new Error("Portfolio generation failed. Please try again.");
    }

    // Validate portfolio content
    if (!portfolio || portfolio.trim().length === 0) {
      throw new Error("Generated portfolio is empty");
    }

    // Clean up the response (remove markdown code blocks if present)
    portfolio = portfolio.replace(/```html\n?/g, "").replace(/```\n?/g, "").trim();
    
    console.log(`[${jobId}] Final portfolio length:`, portfolio.length);
    console.log(`[${jobId}] Portfolio preview:`, portfolio.substring(0, 200));

    // Update status to completed
    if (useDatabase) {
      try {
        const { databases } = await createAdminClient();
        await databases.updateDocument(
          DATABASE_ID,
          JOBS_COLLECTION_ID,
          jobId,
          {
            status: 'completed',
            portfolio,
            provider: usedProvider,
            updatedAt: new Date().toISOString()
          }
        );
        console.log(`[${jobId}] Portfolio generation completed successfully with ${usedProvider} (saved to database)`);
      } catch (dbError) {
        console.error(`[${jobId}] Failed to update job status in database, falling back to memory:`, dbError);
        generationStatus.set(jobId, { status: 'completed', portfolio, provider: usedProvider });
      }
    } else {
      generationStatus.set(jobId, { status: 'completed', portfolio, provider: usedProvider });
      console.log(`[${jobId}] Portfolio generation completed successfully with ${usedProvider} (saved to memory)`);
    }
  } catch (error: unknown) {
    const err = error as Error & { status?: number; statusText?: string };
    console.error(`[${jobId}] Error generating portfolio:`, err);
    console.error(`[${jobId}] Error details:`, {
      message: err.message,
      stack: err.stack,
      name: err.name,
      status: err.status,
      statusText: err.statusText,
    });
    
    // Provide more specific error messages
    let errorMessage = "Failed to generate portfolio. Please try again.";
    
    if (err.message?.includes("API key") || err.message?.includes("API_KEY")) {
      errorMessage = "Invalid API key. Please check your Gemini API key configuration.";
    } else if (err.message?.includes("quota") || err.message?.includes("limit") || err.message?.includes("429")) {
      errorMessage = "API quota exceeded. Please try again later or check your API limits.";
    } else if (err.message?.includes("timeout")) {
      errorMessage = "Request timed out. The portfolio generation took too long. Please try with less information.";
    } else if (err.message?.includes("ENOTFOUND") || err.message?.includes("ECONNREFUSED") || err.message?.includes("fetch")) {
      errorMessage = "Unable to connect to AI service. Please check if the API is accessible.";
    } else if (err.message?.includes("model")) {
      errorMessage = "Model not available. Please verify your API access.";
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    // Update status to failed
    if (useDatabase) {
      try {
        const { databases } = await createAdminClient();
        await databases.updateDocument(
          DATABASE_ID,
          JOBS_COLLECTION_ID,
          jobId,
          {
            status: 'failed',
            error: errorMessage,
            updatedAt: new Date().toISOString()
          }
        );
      } catch (dbError) {
        console.error(`[${jobId}] Failed to update job status in database, falling back to memory:`, dbError);
        generationStatus.set(jobId, { status: 'failed', error: errorMessage });
      }
    } else {
      generationStatus.set(jobId, { status: 'failed', error: errorMessage });
    }
  }
}
