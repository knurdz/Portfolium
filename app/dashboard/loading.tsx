import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex h-screen bg-background text-foreground animate-pulse">
      {/* Sidebar Skeleton */}
      <div className="hidden lg:flex w-64 flex-col border-r border-border bg-card p-6 space-y-6">
        <div className="h-8 w-32 bg-muted rounded-xl"></div>
        <div className="space-y-3 pt-6">
          <div className="h-10 w-full bg-muted rounded-lg"></div>
          <div className="h-10 w-full bg-muted/60 rounded-lg"></div>
          <div className="h-10 w-full bg-muted/40 rounded-lg"></div>
          <div className="h-10 w-full bg-muted/30 rounded-lg"></div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col">
        <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
          <div className="h-6 w-40 bg-muted rounded"></div>
          <div className="h-8 w-8 bg-muted rounded-full"></div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            <p className="text-sm text-muted-foreground font-medium">Preparing workspace...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
