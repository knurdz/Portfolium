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
import { Eye, EyeOff, Lock, CheckCircle2, XCircle, Sparkles, AlertCircle } from "lucide-react";

import { resetPassword } from "@/lib/actions/auth";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, formAction, isPending] = useActionState(resetPassword, null);

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const passwordsDontMatch = password && confirmPassword && password !== confirmPassword;

  return (
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

              <form action={formAction} className="space-y-4">
                <input type="hidden" name="userId" value={userId || ""} />
                <input type="hidden" name="secret" value={secret || ""} />
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-sm font-medium text-[#111827]">
                    New password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 pl-10 pr-10 border-[#D1D5DB] focus-visible:ring-[#6366F1] focus-visible:ring-2 focus-visible:border-[#6366F1] transition-all"
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
                  {password && password.length < 8 && (
                    <p className="text-xs text-[#EF4444] flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      Password must be at least 8 characters
                    </p>
                  )}
                  {password && password.length >= 8 && (
                    <p className="text-xs text-[#10B981] flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Password meets requirements
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#111827]">
                    Confirm password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className={`h-11 pl-10 pr-10 border-[#D1D5DB] focus-visible:ring-[#6366F1] focus-visible:ring-2 focus-visible:border-[#6366F1] transition-all ${
                        passwordsMatch ? "border-[#10B981]" : passwordsDontMatch ? "border-[#EF4444]" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#4F46E5] transition-colors focus:outline-none focus:text-[#4F46E5]"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && (
                    <div className="flex items-center gap-1.5">
                      {passwordsMatch ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                          <span className="text-xs text-[#10B981]">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3.5 w-3.5 text-[#EF4444]" />
                          <span className="text-xs text-[#EF4444]">Passwords do not match</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={!passwordsMatch || password.length < 8 || isPending}
                  className="w-full h-11 bg-linear-to-r from-[#4F46E5] to-[#6366F1] hover:from-[#3730A3] hover:to-[#4F46E5] text-white font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? "Resetting..." : "Reset Password"}
                </Button>
              </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#E5E7EB]" />
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#4F46E5] hover:text-[#3730A3] transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </CardContent>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#F9FAFB] via-[#EEF2FF] to-[#E0E7FF] px-4 py-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4F46E5]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0EA5E9]/5 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-[440px] shadow-xl border-[#D1D5DB] bg-white/95 backdrop-blur-sm relative z-10">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="flex justify-center mb-1">
            <Link href="/" className="w-12 h-12 bg-linear-to-br from-[#4F46E5] to-[#6366F1] rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <Sparkles className="w-6 h-6 text-white" />
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-[#111827] tracking-tight">
            Reset your password
          </CardTitle>
          <CardDescription className="text-sm text-[#6B7280]">
            Create a new password to secure your account
          </CardDescription>
        </CardHeader>

        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </Card>
    </div>
  );
}
