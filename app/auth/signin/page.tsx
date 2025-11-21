"use client";

import { useState, useActionState, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

import { signIn, signInWithOAuth } from "@/lib/actions/auth";
import { useSearchParams } from "next/navigation";

function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const successMessage = searchParams.get("success");
  
  const [state, formAction, isPending] = useActionState(signIn, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#F9FAFB] via-[#EEF2FF] to-[#E0E7FF] px-4 py-6">
      {/* Subtle Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4F46E5]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0EA5E9]/5 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-[440px] shadow-xl border-[#D1D5DB] bg-white/95 backdrop-blur-sm relative z-10">
        <CardHeader className="space-y-2 text-center pb-5">
          {/* Logo/Brand */}
          <div className="flex justify-center mb-1">
            <div className="w-12 h-12 bg-linear-to-br from-[#4F46E5] to-[#6366F1] rounded-xl flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-[#111827] tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription className="text-sm text-[#6B7280]">
            Sign in to your Portfolium account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 px-6 pb-6">
          {successMessage && (
            <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
              <p className="text-xs text-green-600 leading-relaxed">
                {decodeURIComponent(successMessage)}
              </p>
            </div>
          )}
          {(state?.error || urlError) && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
              <p className="text-xs text-red-600 leading-relaxed">
                {state?.error || decodeURIComponent(urlError || "")}
              </p>
            </div>
          )}
          <form action={formAction} className="space-y-4">
          {/* Email Input */}
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
                className="h-11 pl-10 border-[#D1D5DB] focus-visible:ring-[#6366F1] focus-visible:ring-2 focus-visible:border-[#6366F1] transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-[#111827]">
                Password
              </Label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-[#4F46E5] hover:text-[#3730A3] transition-colors hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="h-11 pl-10 pr-10 border-[#D1D5DB] focus-visible:ring-[#6366F1] focus-visible:ring-2 focus-visible:border-[#6366F1] transition-all placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#4F46E5] transition-colors focus:outline-none focus:text-[#4F46E5]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              className="data-[state=checked]:bg-[#4F46E5] data-[state=checked]:border-[#4F46E5]"
            />
            <label
              htmlFor="remember"
              className="text-sm text-[#6B7280] cursor-pointer select-none"
            >
              Remember me for 30 days
            </label>
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-11 bg-linear-to-r from-[#4F46E5] to-[#6366F1] hover:from-[#3730A3] hover:to-[#4F46E5] text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#E5E7EB]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-[#6B7280] font-medium">or continue with</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {/* Google Button */}
            <form action={signInWithOAuth.bind(null, "google")}>
            <Button
              variant="outline"
              className="w-full h-10 border-[#D1D5DB] hover:bg-[#F9FAFB] hover:border-[#4F46E5] transition-all"
            >
              <svg
                className="mr-2 h-4 w-4 shrink-0"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-sm">Google</span>
            </Button>
            </form>

            {/* GitHub Button */}
            <form action={signInWithOAuth.bind(null, "github")}>
            <Button
              variant="outline"
              className="w-full h-10 border-[#D1D5DB] hover:bg-[#F9FAFB] hover:border-[#4F46E5] transition-all"
            >
              <svg
                className="mr-2 h-4 w-4 shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">GitHub</span>
            </Button>
            </form>
          </div>

          {/* Sign Up Link */}
          <div className="text-center text-sm pt-1">
            <span className="text-[#6B7280]">Don&apos;t have an account? </span>
            <Link
              href="/auth/signup"
              className="font-semibold text-[#4F46E5] hover:text-[#3730A3] transition-colors hover:underline"
            >
              Sign up →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
