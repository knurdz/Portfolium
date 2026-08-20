import { Loader2 } from "lucide-react";

export default function SignInLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-6">
      <div className="w-full max-w-[440px] p-8 rounded-3xl border border-border bg-card/80 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
        <p className="text-sm text-muted-foreground font-medium">Loading sign in...</p>
      </div>
    </div>
  );
}
