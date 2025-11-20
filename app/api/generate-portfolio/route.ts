import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

// Fallback using Hugging Face (also free)
async function generateWithHuggingFace(userInfo: string) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    throw new Error("HUGGINGFACE_API_KEY not configured");
  }

  const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: `Create a complete HTML portfolio page with embedded CSS based on this information: ${userInfo.substring(0, 1500)}. Return only HTML code, no explanations.`,
      parameters: {
        max_new_tokens: 3000,
        temperature: 0.7,
      }
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Hugging Face API error");
  }

  const data = await response.json();
  return data[0].generated_text;
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

    let portfolio = "";
    let usedProvider = "";

    // Try Gemini first
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        console.log(`Trying Gemini AI with model: ${selectedModel}...`);
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: selectedModel });

        const prompt = `You are a professional portfolio website generator. Based on the following user information, create a beautiful, modern, and responsive portfolio HTML page.

User Information:
${userInfo.substring(0, 500)}${userInfo.length > 500 ? "..." : ""}

Requirements:
1. Create a complete, single-page HTML portfolio with embedded CSS
2. Include sections: Hero/Header, About, Skills, Experience, Education, Projects, Contact
3. Use modern, clean design with a professional color scheme
4. Make it fully responsive (mobile-friendly)
5. Include smooth animations and transitions
6. Use semantic HTML5 elements
7. Add Font Awesome icons (via CDN) for visual appeal
8. Use Google Fonts for typography
9. Ensure the design is visually appealing and professional
10. Extract and organize all relevant information from the user's data

Return ONLY the complete HTML code, no explanations or markdown code blocks. The HTML should be ready to render directly.`;

        const result = await Promise.race([
          model.generateContent(prompt),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error("Request timeout")), 60000)
          )
        ]);
        
        const response = result.response;
        portfolio = response.text();
        usedProvider = "Gemini";
        console.log("Portfolio generated successfully with Gemini");
      }
    } catch (geminiError) {
      console.log("Gemini failed, trying Groq...", geminiError);
      
      // Try Groq as fallback
      try {
        portfolio = await generateWithGroq(userInfo);
        usedProvider = "Groq (Llama 3.3)";
        console.log("Portfolio generated successfully with Groq");
      } catch (groqError) {
        console.log("Groq failed, trying Hugging Face...", groqError);
        
        // Try Hugging Face as last resort
        try {
          portfolio = await generateWithHuggingFace(userInfo);
          usedProvider = "Hugging Face (Mixtral)";
          console.log("Portfolio generated successfully with Hugging Face");
        } catch {
          console.error("All AI providers failed");
          throw new Error("All AI providers are currently unavailable. Please try again later.");
        }
      }
    }

    // Clean up the response (remove markdown code blocks if present)
    portfolio = portfolio.replace(/```html\n?/g, "").replace(/```\n?/g, "").trim();

    return NextResponse.json({ 
      portfolio,
      provider: usedProvider 
    });
  } catch (error: unknown) {
    const err = error as Error & { status?: number; statusText?: string };
    console.error("Error generating portfolio:", err);
    console.error("Error details:", {
      message: err.message,
      stack: err.stack,
      name: err.name,
      status: err.status,
      statusText: err.statusText,
    });
    
    // Provide more specific error messages
    let errorMessage = "Failed to generate portfolio. Please try again.";
    let statusCode = 500;
    
    if (err.message?.includes("API key") || err.message?.includes("API_KEY")) {
      errorMessage = "Invalid API key. Please check your Gemini API key configuration.";
      statusCode = 401;
    } else if (err.message?.includes("quota") || err.message?.includes("limit") || err.message?.includes("429")) {
      errorMessage = "API quota exceeded. Please try again later or check your API limits.";
      statusCode = 429;
    } else if (err.message?.includes("timeout")) {
      errorMessage = "Request timed out. The portfolio generation took too long. Please try with less information.";
      statusCode = 504;
    } else if (err.message?.includes("ENOTFOUND") || err.message?.includes("ECONNREFUSED") || err.message?.includes("fetch")) {
      errorMessage = "Unable to connect to Gemini API. Please check if the API is accessible from your network.";
      statusCode = 503;
    } else if (err.message?.includes("model")) {
      errorMessage = "Model not available. Please verify your Gemini API access.";
      statusCode = 400;
    }
    
    return NextResponse.json(
      { error: errorMessage, details: err.message },
      { status: statusCode }
    );
  }
}
