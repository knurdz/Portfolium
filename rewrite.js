const fs = require('fs');

const content = `import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sparkles,
  Wand2,
  LayoutTemplate,
  Upload,
  MousePointerClick,
  Palette,
  Zap,
  Star,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-16 items-center justify-between mx-auto px-4 max-w-7xl">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl">Portfolium</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#templates" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Templates
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/auth/signin" className="hidden sm:inline-block">
              <Button variant="outline" className="border-border hover:bg-muted">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-background py-20 sm:py-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <Badge variant="outline" className="border-indigo-500/30 text-indigo-600 dark:text-indigo-400 bg-background/50 backdrop-blur">
              ✨ AI-Powered Portfolio Builder
            </Badge>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              Build Your Portfolio <br className="hidden sm:block" />
              <span className="bg-linear-to-r from-indigo-500 to-sky-500 bg-clip-text text-transparent">
                in Minutes
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              AI-powered creator tools to help you craft a stunning professional portfolio. No design skills required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 h-12 px-8 text-base shadow-lg">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#templates">
                <Button size="lg" variant="outline" className="border-border hover:bg-muted h-12 px-8 text-base">
                  See Templates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-lg text-muted-foreground">
              Powerful features to create, customize, and publish your portfolio in minutes
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow bg-card">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                  <Wand2 className="w-6 h-6 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold">AI Portfolio Builder</h3>
                <p className="text-muted-foreground">
                  Build your portfolio from a simple prompt. Our AI creates a personalized layout just for you.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow bg-card">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center">
                  <LayoutTemplate className="w-6 h-6 text-sky-500" />
                </div>
                <h3 className="text-xl font-semibold">Start With Templates</h3>
                <p className="text-muted-foreground">
                  Choose from dozens of modern, professionally designed templates tailored to your industry.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow bg-card">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <Upload className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-semibold">Upload Your CV</h3>
                <p className="text-muted-foreground">
                  Upload your existing CV and watch as our AI automatically generates portfolio sections.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow bg-card">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <MousePointerClick className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold">Full Drag-and-Drop</h3>
                <p className="text-muted-foreground">
                  Intuitive visual editor lets you drag, drop, and customize every element with ease.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow bg-card">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center">
                  <Palette className="w-6 h-6 text-rose-500" />
                </div>
                <h3 className="text-xl font-semibold">Custom Sections</h3>
                <p className="text-muted-foreground">
                  Add custom sections, choose color themes, and personalize fonts to match your brand.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow bg-card">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold">Fast Publishing</h3>
                <p className="text-muted-foreground">
                  Deploy your portfolio instantly with a custom domain or shareable link. No hosting needed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Three simple steps to your perfect portfolio</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-linear-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold">Choose or Upload</h3>
              <p className="text-muted-foreground">
                Select a template that fits your style or upload your existing CV to get started instantly.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-linear-to-br from-sky-500 to-sky-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold">Customize with AI</h3>
              <p className="text-muted-foreground">
                Use our AI tools and drag-and-drop editor to personalize content, colors, and layout.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-linear-to-br from-emerald-500 to-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold">Publish & Share</h3>
              <p className="text-muted-foreground">
                Publish your portfolio with one click and share your unique link with the world.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="py-8 border-t border-border bg-background">
        <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <span className="font-bold">Portfolium</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Portfolium. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
`;

fs.writeFileSync('app/page.tsx', content);
