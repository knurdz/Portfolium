import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://portfolium.knurdz.org";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/auth/reset-password", "/auth/verify"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
