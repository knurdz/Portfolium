import { NextRequest, NextResponse } from "next/server";
import { savePortfolio } from "@/lib/actions/portfolio";
import { createSessionClient } from "@/lib/appwrite";

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    try {
      const { account } = await createSessionClient();
      await account.get();
    } catch {
      return NextResponse.json(
        { error: "Authentication required. Please sign in." },
        { status: 401 }
      );
    }

    const { subdomain, htmlContent } = await request.json();

    if (!subdomain || !htmlContent) {
      return NextResponse.json(
        { error: "Subdomain and HTML content are required" },
        { status: 400 }
      );
    }

    const result = await savePortfolio(subdomain, htmlContent);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      portfolioId: result.portfolioId,
      url: result.url,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error saving portfolio:", err.message);
    return NextResponse.json(
      { error: "Failed to save portfolio" },
      { status: 500 }
    );
  }
}
