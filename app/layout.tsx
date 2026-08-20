import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://portfolium.knurdz.org";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Portfolium - AI-Powered Portfolio Generator",
    template: "%s | Portfolium",
  },
  description: "Create stunning professional developer portfolios in seconds with AI. Turn your CV into a live personal portfolio website with zero design skills required.",
  keywords: [
    "portfolio generator",
    "AI portfolio",
    "developer portfolio builder",
    "CV to portfolio",
    "personal website generator",
    "Next.js portfolio"
  ],
  authors: [{ name: "Knurdz", url: "https://knurdz.org" }],
  creator: "Knurdz",
  publisher: "Portfolium",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Portfolium - AI-Powered Portfolio Generator",
    description: "Create stunning professional developer portfolios in seconds with AI",
    url: appUrl,
    siteName: "Portfolium",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolium - AI-Powered Portfolio Generator",
    description: "Create stunning professional portfolios in seconds with AI",
  },
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Portfolium",
  url: appUrl,
  description: "Create stunning professional developer portfolios in seconds with AI.",
  applicationCategory: "DesignApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
