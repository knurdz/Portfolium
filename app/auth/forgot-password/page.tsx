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
import { ThemeToggle } from "@/components/theme-toggle";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [state, formAction, isPending] = useActionState(forgotPassword, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 relative overflow-hidden">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Subtle Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-[440px] shadow-xl border-border bg-card/95 backdrop-blur-sm relative z-10">
        <CardHeader className="space-y-2 text-center pb-6">
          {/* Logo/Brand */}
          <div className="flex justify-center mb-1">
            <Link href="/" className="w-12 h-12 bg-linear-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground tracking-tight">
            Forgot your password?
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Enter the email associated with your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 px-6 pb-6">
              {/* Error Message */}
              {state?.error && (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <p className="text-xs text-destructive leading-relaxed">
                    {state.error}
                  </p>
                </div>
              )}

              {/* Info Message */}
              <div className="flex items-start gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <Mail className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-primary leading-relaxed">
                  We&apos;ll send you a link to reset your password
                </p>
              </div>

              {/* Email Input Form */}
              <form action={formAction} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11 pl-10 border-input focus-visible:ring-primary focus-visible:ring-2 focus-visible:border-primary transition-all placeholder:text-muted-foreground/50"
                    />
                  </div>
                </div>

                {/* Send Reset Link Button */}
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {isPending ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
          </div>

          {/* Back to Sign In Link */}
          <div className="text-center mt-8">
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Sign In</span>
            </Link>
          </div>

          {/* Alternative: Create Account */}
          <div className="text-center text-sm pt-2">
            <span className="text-muted-foreground">Don&apos;t have an account? </span>
            <Link
              href="/auth/signup"
              className="font-semibold text-primary hover:text-primary/80 transition-colors hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
