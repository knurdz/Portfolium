"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, ArrowLeft, Sparkles, AlertCircle } from "lucide-react";

import { forgotPassword } from "@/lib/actions/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [state, formAction, isPending] = useActionState(forgotPassword, { error: "" });

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#F9FAFB] via-[#EEF2FF] to-[#E0E7FF] px-4 py-8">
      {/* Subtle Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4F46E5]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0EA5E9]/5 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-[440px] shadow-xl border-[#D1D5DB] bg-white/95 backdrop-blur-sm relative z-10">
        <CardHeader className="space-y-2 text-center pb-6">
          {/* Logo/Brand */}
          <div className="flex justify-center mb-1">
            <div className="w-12 h-12 bg-linear-to-br from-[#4F46E5] to-[#6366F1] rounded-xl flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-[#111827] tracking-tight">
            Forgot your password?
          </CardTitle>
          <CardDescription className="text-sm text-[#6B7280]">
            Enter the email associated with your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 px-6 pb-6">
              {/* Error Message */}
              {state?.error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-600 leading-relaxed">
                    {state.error}
                  </p>
                </div>
              )}

              {/* Info Message */}
              <div className="flex items-start gap-2 p-3 bg-[#EEF2FF] border border-[#C7D2FE] rounded-lg">
                <Mail className="h-4 w-4 text-[#4F46E5] mt-0.5 shrink-0" />
                <p className="text-xs text-[#4F46E5] leading-relaxed">
                  We&apos;ll send you a link to reset your password
                </p>
              </div>

              {/* Email Input Form */}
              <form action={formAction} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium text-[#111827]">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11 pl-10 border-[#D1D5DB] focus-visible:ring-[#6366F1] focus-visible:ring-2 focus-visible:border-[#6366F1] transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Send Reset Link Button */}
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-11 bg-linear-to-r from-[#4F46E5] to-[#6366F1] hover:from-[#3730A3] hover:to-[#4F46E5] text-white font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {isPending ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#E5E7EB]" />
            </div>
          </div>

          {/* Back to Sign In Link */}
          <div className="text-center mt-8">
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#6B7280] hover:text-[#4F46E5] transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Sign In</span>
            </Link>
          </div>

          {/* Alternative: Create Account */}
          <div className="text-center text-sm pt-2">
            <span className="text-[#6B7280]">Don&apos;t have an account? </span>
            <Link
              href="/auth/signup"
              className="font-semibold text-[#4F46E5] hover:text-[#3730A3] transition-colors hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
