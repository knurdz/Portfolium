"use client";

import { useState, useActionState } from "react";
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
import { Eye, EyeOff, Mail, Lock, Sparkles, User, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

import { signUp } from "@/lib/actions/auth";
import { account, OAuthProvider } from "@/lib/appwrite-client";

function OAuthButtons({ onSignIn }: { readonly onSignIn: (p: OAuthProvider) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={() => onSignIn(OAuthProvider.Google)}
        className="w-full h-10 border-input hover:bg-accent hover:border-primary transition-all"
      >
        <svg
          className="mr-2 h-4 w-4 flex-shrink-0"
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
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        <span className="text-sm">Google</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => onSignIn(OAuthProvider.Github)}
        className="w-full h-10 border-input hover:bg-accent hover:border-primary transition-all"
      >
        <svg
          className="mr-2 h-4 w-4 flex-shrink-0"
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
    </div>
  );
}

function PasswordStrengthIndicator({ password, strength, label, color, barColor }: { 
  readonly password: string; 
  readonly strength: number; 
  readonly label: string; 
  readonly color: string; 
  readonly barColor: string; 
}) {
  if (!password) return null;
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-300 ${barColor}`}></div>
        </div>
        <span className={`text-xs font-medium ${color}`}>
          {label}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        Must be at least 8 characters with uppercase, lowercase, and numbers
      </p>
    </div>
  );
}

function PasswordMatchIndicator({ confirmPassword, match }: { 
  readonly confirmPassword: string; 
  readonly match: boolean; 
}) {
  if (!confirmPassword) return null;
  return (
    <div className="flex items-center gap-1.5">
      {match ? (
        <>
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-xs text-emerald-500">Passwords match</span>
        </>
      ) : (
        <>
          <XCircle className="h-3.5 w-3.5 text-destructive" />
          <span className="text-xs text-destructive">Passwords do not match</span>
        </>
      )}
    </div>
  );
}

function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const [state, formAction, isPending] = useActionState(signUp, null);

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { strength: 0, label: "", color: "" };
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (pass.length >= 12) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[^a-zA-Z0-9]/.test(pass)) strength++;

    if (strength <= 2) return { strength, label: "Weak", color: "text-destructive" };
    if (strength <= 3) return { strength, label: "Fair", color: "text-orange-500" };
    if (strength <= 4) return { strength, label: "Good", color: "text-blue-500" };
    return { strength, label: "Strong", color: "text-emerald-500" };
  };

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const passwordsDontMatch = password && confirmPassword && password !== confirmPassword;

  let strengthBarColor = "bg-emerald-500 w-full";
  if (passwordStrength.strength <= 2) {
    strengthBarColor = "bg-red-500 w-1/3";
  } else if (passwordStrength.strength <= 3) {
    strengthBarColor = "bg-amber-500 w-2/3";
  } else if (passwordStrength.strength <= 4) {
    strengthBarColor = "bg-sky-500 w-5/6";
  }

  let confirmPasswordBorder = "";
  if (passwordsMatch) {
    confirmPasswordBorder = "border-emerald-500";
  } else if (passwordsDontMatch) {
    confirmPasswordBorder = "border-destructive";
  }

  const handleOAuthSignIn = (provider: OAuthProvider) => {
    account.createOAuth2Session({
      provider,
      success: `${globalThis.location.origin}/dashboard`,
      failure: `${globalThis.location.origin}/auth/signup?error=OAuth+cancelled`
    });
  };

  return (
    <CardContent className="space-y-4 px-6 pb-6">
      {state?.error && (
        <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
          <p className="text-xs text-destructive leading-relaxed">{state.error}</p>
        </div>
      )}
      <form 
        action={formAction} 
        className="space-y-4"
        onSubmit={(e) => {
          if (!passwordsMatch && confirmPassword) {
            e.preventDefault();
          }
        }}
      >
      {/* Full Name Input */}
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-sm font-medium text-foreground">
          Full name
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 pl-10 border-input focus-visible:ring-primary focus-visible:ring-2 focus-visible:border-primary transition-all placeholder:text-muted-foreground/50"
          />
        </div>
      </div>

      {/* Email Input */}
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
            className="h-11 pl-10 border-input focus-visible:ring-primary focus-visible:ring-2 focus-visible:border-primary transition-all placeholder:text-muted-foreground/50"
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 pl-10 pr-10 border-input focus-visible:ring-primary focus-visible:ring-2 focus-visible:border-primary transition-all placeholder:text-muted-foreground/50"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:text-primary"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <PasswordStrengthIndicator 
          password={password} 
          strength={passwordStrength.strength} 
          label={passwordStrength.label} 
          color={passwordStrength.color} 
          barColor={strengthBarColor} 
        />
      </div>

      {/* Confirm Password Input */}
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
          Confirm password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`h-11 pl-10 pr-10 border-input focus-visible:ring-primary focus-visible:ring-2 focus-visible:border-primary placeholder:text-muted-foreground/50 transition-all ${confirmPasswordBorder}`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:text-primary"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <PasswordMatchIndicator 
          confirmPassword={confirmPassword} 
          match={passwordsMatch || false} 
        />
      </div>

      {/* Terms Checkbox */}
      <div className="flex items-start space-x-2 pt-1">
        <Checkbox
          id="terms"
          checked={agreedToTerms}
          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
          className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        <label
          htmlFor="terms"
          className="text-sm text-muted-foreground leading-snug cursor-pointer"
        >
          I agree to the{" "}
          <Link href="/terms" className="text-primary hover:text-primary/80 underline underline-offset-2">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:text-primary/80 underline underline-offset-2">
            Privacy Policy
          </Link>
        </label>
      </div>

      {/* Create Account Button */}
      <Button
        type="submit"
        disabled={!agreedToTerms || isPending}
        className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Creating account..." : "Create Account"}
      </Button>
      </form>

      {/* Email Verification Notice */}
      <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-blue-500 leading-relaxed">
          We&apos;ll send a verification email to confirm your address
        </p>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-3 text-muted-foreground font-medium">or continue with</span>
        </div>
      </div>

      <OAuthButtons onSignIn={handleOAuthSignIn} />

      {/* Sign In Link */}
      <div className="text-center text-sm pt-1">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link
          href="/auth/signin"
          className="font-semibold text-primary hover:text-primary/80 transition-colors hover:underline"
        >
          Sign in →
        </Link>
      </div>
    </CardContent>
  );
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 relative overflow-hidden">
      {/* Subtle Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-[480px] shadow-xl border-border bg-card/95 backdrop-blur-sm relative z-10">
        <CardHeader className="space-y-2 text-center pb-4">
          {/* Logo/Brand */}
          <div className="flex justify-center mb-1">
            <Link href="/" className="w-12 h-12 bg-linear-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground tracking-tight">
            Create your account
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Join Portfolium and showcase your work to the world
          </CardDescription>
        </CardHeader>
        
        <SignUpForm />
      </Card>
    </div>
  );
}
