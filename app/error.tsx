"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-md w-full text-center space-y-6 p-8 rounded-3xl border border-border bg-card/80 backdrop-blur-xl shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto shadow-inner">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Something went wrong</h2>
          <p className="text-sm text-muted-foreground">
            An unexpected error occurred. Please try reloading or check your network connection.
          </p>
        </div>
        <div className="flex justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="rounded-full bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 shadow-md"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              globalThis.location.href = "/";
            }}
            className="rounded-full border-border"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
