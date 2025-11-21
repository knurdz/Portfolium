import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolium - AI-Powered Portfolio Generator",
  description: "Create stunning professional portfolios in seconds with AI. Generate personalized portfolio websites from your CV using advanced AI technology.",
  keywords: ["portfolio generator", "AI portfolio", "CV to portfolio", "professional portfolio", "portfolio builder"],
  authors: [{ name: "Knurdz" }],
  openGraph: {
    title: "Portfolium - AI-Powered Portfolio Generator",
    description: "Create stunning professional portfolios in seconds with AI",
    url: "https://portfolium.knurdz.org",
    siteName: "Portfolium",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolium - AI-Powered Portfolio Generator",
    description: "Create stunning professional portfolios in seconds with AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-linear-to-br from-[#F9FAFB] via-[#EEF2FF] to-[#E0E7FF]">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-transparent`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
