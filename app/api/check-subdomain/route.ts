import { NextRequest, NextResponse } from "next/server";
import { checkSubdomainAvailability } from "@/lib/actions/portfolio";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subdomain = searchParams.get("subdomain");

    if (!subdomain) {
      return NextResponse.json(
        { error: "Subdomain parameter is required" },
        { status: 400 }
      );
    }

    const result = await checkSubdomainAvailability(subdomain);

    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error checking subdomain:", err);
    return NextResponse.json(
      { available: false, error: err.message || "Failed to check subdomain" },
      { status: 500 }
    );
  }
}
