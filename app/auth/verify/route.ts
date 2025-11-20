import { Client, Account } from "node-appwrite";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const secret = request.nextUrl.searchParams.get("secret");

  if (!userId || !secret) {
    return NextResponse.redirect(new URL("/auth/signin?error=Missing+verification+credentials", request.url));
  }

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const account = new Account(client);

  try {
    await account.updateVerification(userId, secret);
    return NextResponse.redirect(new URL("/dashboard?verified=true", request.url));
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(new URL("/auth/signin?error=Verification+failed", request.url));
  }
}
