"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, AlertCircle, Sparkles } from "lucide-react";
import { Suspense } from "react";

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-linear-to-br from-[#F9FAFB] via-[#EEF2FF] to-[#E0E7FF]">
      <Card className="w-full max-w-md border-[#E5E7EB] shadow-lg">
        <CardHeader className="text-center space-y-3 pb-4">
          <div className="flex justify-center mb-1">
            <div className="w-16 h-16 bg-linear-to-br from-[#4F46E5] to-[#6366F1] rounded-xl flex items-center justify-center shadow-md">
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-[#111827] tracking-tight">
            Check your email
          </CardTitle>
          <CardDescription className="text-sm text-[#6B7280]">
            We&apos;ve sent you a verification link
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 px-6 pb-6">
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
              <p className="text-xs text-red-600 leading-relaxed">{error}</p>
            </div>
          )}
          
          <div className="text-center space-y-3">
            <p className="text-sm text-[#6B7280]">
              We have sent a verification link to your email address.
            </p>
            <p className="text-sm text-[#6B7280]">
              Please check your inbox and click the link to verify your account before accessing the dashboard.
            </p>
          </div>

          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mt-4">
            <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-600 leading-relaxed">
              Don&apos;t see the email? Check your spam folder or request a new verification link.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckEmail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckEmailContent />
    </Suspense>
  );
}
