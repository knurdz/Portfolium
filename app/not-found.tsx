import Link from "next/link";
import { Layers, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function NotFound() {
  return (
    <div className="relative min-h-[100dvh] bg-background text-foreground flex flex-col justify-between font-sans selection:bg-violet-500/30 overflow-hidden">
      {/* 3D Perspective Neon Grid Background */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none w-full h-[100vh] opacity-50 dark:opacity-60 overflow-hidden"
        style={{ perspective: '800px' }}
      >
        <div 
          className="absolute w-[200vw] h-[150vh] left-[-50vw] bottom-0 origin-bottom"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(139, 92, 246, 0.4) 2px, transparent 2px),
              linear-gradient(to top, rgba(139, 92, 246, 0.4) 2px, transparent 2px)
            `,
            backgroundSize: '4rem 4rem',
            transform: 'rotateX(75deg)',
            maskImage: 'linear-gradient(to top, black 5%, transparent 70%)',
            WebkitMaskImage: 'linear-gradient(to top, black 5%, transparent 70%)',
            animation: 'grid-move 10s linear infinite'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-violet-500/10 via-transparent to-transparent pointer-events-none z-0 mix-blend-screen" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-md shadow-violet-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg tracking-tight">Portfolium</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main 404 Content */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 my-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300 text-sm font-medium mb-6">
          Error 404
        </div>
        <h1 className="text-6xl sm:text-8xl font-black tracking-tight mb-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
          Lost in Space
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-md mb-8">
          The page or portfolio you are looking for doesn&apos;t exist or might have been relocated.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-all shadow-lg shadow-violet-500/25 hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Safety
        </Link>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-muted-foreground border-t border-border/50">
        © {new Date().getFullYear()} Portfolium. All rights reserved.
      </footer>
    </div>
  );
}
