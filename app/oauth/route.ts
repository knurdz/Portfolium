import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Client, Account } from "node-appwrite";

export async function GET(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;

  try {
    // Create a client to check the session
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    // Get the cookies from the request
    const cookieStore = await cookies();
    
    // Appwrite sets various session cookies during OAuth flow
    // We need to find and use the session cookie
    const allCookies = cookieStore.getAll();
    const appwriteSessionCookie = allCookies.find(
      cookie => cookie.name.startsWith('a_session_')
    );

    if (!appwriteSessionCookie) {
      console.error("No Appwrite session cookie found");
      return NextResponse.redirect(new URL("/auth/signin?error=Missing+credentials", baseUrl));
    }

    // Set the session in the client
    client.setSession(appwriteSessionCookie.value);
    const account = new Account(client);
    
    // Verify the session is valid by getting account details
    await account.get();

    // Store the session in our app's cookie
    cookieStore.set("appwrite-session", appwriteSessionCookie.value, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return NextResponse.redirect(new URL("/dashboard", baseUrl));
  } catch (error) {
    console.error("OAuth error:", error);
    return NextResponse.redirect(new URL("/auth/signin?error=OAuth+authentication+failed", baseUrl));
  }
}
