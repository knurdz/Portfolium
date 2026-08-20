import { NextRequest, NextResponse } from "next/server";
import { generateJobId, generationStatus, cleanupOldJobs } from "./storage";
import { createAdminClient, createSessionClient, DATABASE_ID, JOBS_COLLECTION_ID } from "@/lib/appwrite";
import { PORTFOLIO_TEMPLATES } from "@/lib/templates";

// Simple in-memory rate limiter (per-user, 5 requests per minute)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 5;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

// Strip potentially dangerous content from user input
function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .substring(0, 10000); // Limit input length
}

async function generateWithGroq(userInfo: string, templateId?: string) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY not configured");
  }

  const template = templateId && PORTFOLIO_TEMPLATES[templateId as keyof typeof PORTFOLIO_TEMPLATES] 
    ? PORTFOLIO_TEMPLATES[templateId as keyof typeof PORTFOLIO_TEMPLATES] 
    : null;

  const templatePrompt = template ? `\n\nSpecific Style Requirements (${template.name}):\n${template.systemPrompt}` : "";

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
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

Return ONLY the complete HTML code, no explanations or markdown code blocks. The HTML should be ready to render directly.${templatePrompt}`
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
    // Authentication check
    let userId: string;
    try {
      const { account } = await createSessionClient();
      const user = await account.get();
      userId = user.$id;
    } catch {
      return NextResponse.json(
        { error: "Authentication required. Please sign in." },
        { status: 401 }
      );
    }

    // Rate limiting
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute before trying again." },
        { status: 429 }
      );
    }

    // Cleanup old in-memory jobs
    cleanupOldJobs();

    const formData = await request.formData();
    const details = formData.get("details") as string;
    const cvFile = formData.get("cv") as File | null;
    const selectedModel = formData.get("model") as string || "groq";
    const template = formData.get("template") as string || "";

    let userInfo = details ? sanitizeInput(details) : "";

    // If CV file is provided, extract text from it
    if (cvFile) {
      try {
        const cvText = await cvFile.text();
        userInfo += `\n\nCV Content:\n${sanitizeInput(cvText)}`;
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
    } catch (dbError: unknown) {
      console.warn(`[${jobId}] Database unavailable, using in-memory storage:`, (dbError as Error).message);
      useDatabase = false;
      generationStatus.set(jobId, { status: 'processing', createdAt: Date.now() });
    }
    
    // Start async generation (don't await)
    generatePortfolioAsync(jobId, userInfo, selectedModel, useDatabase, template);

    // Return job ID immediately
    return NextResponse.json({ 
      jobId,
      message: "Portfolio generation started. Poll /api/generate-portfolio/status?jobId=" + jobId
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error starting portfolio generation:", err.message);
    return NextResponse.json(
      { error: "Failed to start portfolio generation" },
      { status: 500 }
    );
  }
}

// Async generation function
async function generatePortfolioAsync(jobId: string, userInfo: string, selectedModel: string, useDatabase: boolean = true, templateId?: string) {
  try {
    let portfolio = "";
    let usedProvider = "";

    try {
      portfolio = await generateWithGroq(userInfo, templateId);
      usedProvider = `Groq Llama 3.3 70B (${templateId || 'Default'})`;
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
      } catch (dbError) {
        console.error(`[${jobId}] Database update failed, falling back to memory:`, dbError);
        generationStatus.set(jobId, { status: 'completed', portfolio, provider: usedProvider, createdAt: Date.now() });
      }
    } else {
      generationStatus.set(jobId, { status: 'completed', portfolio, provider: usedProvider, createdAt: Date.now() });
    }
  } catch (error: unknown) {
    const err = error as Error & { status?: number; statusText?: string };
    console.error(`[${jobId}] Error generating portfolio:`, err.message);
    
    let errorMessage = "Failed to generate portfolio. Please try again.";
    
    if (err.message?.includes("API key") || err.message?.includes("API_KEY")) {
      errorMessage = "Invalid API key. Please check your API key configuration.";
    } else if (err.message?.includes("quota") || err.message?.includes("limit") || err.message?.includes("429")) {
      errorMessage = "API quota exceeded. Please try again later or check your API limits.";
    } else if (err.message?.includes("timeout")) {
      errorMessage = "Request timed out. Please try with less information.";
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
        console.error(`[${jobId}] Failed to update job status:`, dbError);
        generationStatus.set(jobId, { status: 'failed', error: errorMessage, createdAt: Date.now() });
      }
    } else {
      generationStatus.set(jobId, { status: 'failed', error: errorMessage, createdAt: Date.now() });
    }
  }
}
