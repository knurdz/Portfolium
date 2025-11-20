import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const url = request.nextUrl;

  // Check if it's a subdomain request (*.portfolium.knurdz.org)
  const subdomainMatch = hostname.match(/^([^.]+)\.portfolium\.knurdz\.org$/);
  
  if (subdomainMatch) {
    const subdomain = subdomainMatch[1];
    
    // Exclude www and main domain
    if (subdomain !== "www" && subdomain !== "portfolium") {
      // Rewrite to portfolio viewer route with subdomain as query param
      url.pathname = `/portfolio/${subdomain}`;
      return NextResponse.rewrite(url);
    }
  }

  // Existing auth middleware
  const session = request.cookies.get("appwrite-session");

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/:path*"],
};
