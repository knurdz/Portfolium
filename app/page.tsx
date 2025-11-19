import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Wand2,
  LayoutTemplate,
  Upload,
  MousePointerClick,
  Palette,
  Zap,
  CheckCircle2,
  Star,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between mx-auto px-4 max-w-7xl">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#4F46E5] to-[#6366F1] rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-[#111827]">Portfolium</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-[#6B7280] hover:text-[#4F46E5] transition-colors">
              Features
            </Link>
            <Link href="#templates" className="text-sm font-medium text-[#6B7280] hover:text-[#4F46E5] transition-colors">
              Templates
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-[#6B7280] hover:text-[#4F46E5] transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin">
              <Button variant="outline" className="border-[#D1D5DB] hover:bg-[#F9FAFB]">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-[#4F46E5] to-[#6366F1] hover:from-[#3730A3] hover:to-[#4F46E5] text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#F9FAFB] via-[#EEF2FF] to-[#E0E7FF] py-20 sm:py-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0EA5E9]/10 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <Badge variant="outline" className="border-[#4F46E5] text-[#4F46E5] bg-white/50 backdrop-blur">
              ✨ AI-Powered Portfolio Builder
            </Badge>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#111827] tracking-tight leading-tight">
              Build Your Portfolio <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[#4F46E5] to-[#0EA5E9] bg-clip-text text-transparent">
                in Minutes
              </span>
            </h1>
            <p className="text-xl text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
              AI-powered creator tools to help you craft a stunning professional portfolio. No design skills required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-gradient-to-r from-[#4F46E5] to-[#6366F1] hover:from-[#3730A3] hover:to-[#4F46E5] text-white h-12 px-8 text-base shadow-lg">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#templates">
                <Button size="lg" variant="outline" className="border-[#D1D5DB] hover:bg-white h-12 px-8 text-base">
                  See Templates
                </Button>
              </Link>
            </div>
            <div className="pt-8">
              <div className="relative max-w-3xl mx-auto">
                <div className="aspect-video bg-gradient-to-br from-white to-[#EEF2FF] rounded-2xl shadow-2xl border border-[#D1D5DB] flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#4F46E5] to-[#6366F1] rounded-xl flex items-center justify-center mx-auto">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-[#6B7280] font-medium">Portfolio Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-[#111827] mb-4">Everything You Need</h2>
            <p className="text-lg text-[#6B7280]">
              Powerful features to create, customize, and publish your portfolio in minutes
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-[#E5E7EB] hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-[#EEF2FF] rounded-xl flex items-center justify-center">
                  <Wand2 className="w-6 h-6 text-[#4F46E5]" />
                </div>
                <h3 className="text-xl font-semibold text-[#111827]">AI Portfolio Builder</h3>
                <p className="text-[#6B7280]">
                  Build your portfolio from a simple prompt. Our AI creates a personalized layout just for you.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-[#DBEAFE] rounded-xl flex items-center justify-center">
                  <LayoutTemplate className="w-6 h-6 text-[#0EA5E9]" />
                </div>
                <h3 className="text-xl font-semibold text-[#111827]">Start With Templates</h3>
                <p className="text-[#6B7280]">
                  Choose from dozens of modern, professionally designed templates tailored to your industry.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-[#FEF3C7] rounded-xl flex items-center justify-center">
                  <Upload className="w-6 h-6 text-[#F59E0B]" />
                </div>
                <h3 className="text-xl font-semibold text-[#111827]">Upload Your CV</h3>
                <p className="text-[#6B7280]">
                  Upload your existing CV and watch as our AI automatically generates portfolio sections.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-[#F3E8FF] rounded-xl flex items-center justify-center">
                  <MousePointerClick className="w-6 h-6 text-[#9333EA]" />
                </div>
                <h3 className="text-xl font-semibold text-[#111827]">Full Drag-and-Drop Editing</h3>
                <p className="text-[#6B7280]">
                  Intuitive visual editor lets you drag, drop, and customize every element with ease.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-[#FEE2E2] rounded-xl flex items-center justify-center">
                  <Palette className="w-6 h-6 text-[#EF4444]" />
                </div>
                <h3 className="text-xl font-semibold text-[#111827]">Custom Sections & Themes</h3>
                <p className="text-[#6B7280]">
                  Add custom sections, choose color themes, and personalize fonts to match your brand.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-[#D1FAE5] rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-[#10B981]" />
                </div>
                <h3 className="text-xl font-semibold text-[#111827]">Publish With One Click</h3>
                <p className="text-[#6B7280]">
                  Deploy your portfolio instantly with a custom domain or shareable link. No hosting needed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F9FAFB]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-[#111827] mb-4">How It Works</h2>
            <p className="text-lg text-[#6B7280]">Three simple steps to your perfect portfolio</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#4F46E5] to-[#6366F1] rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-[#111827]">Choose or Upload</h3>
              <p className="text-[#6B7280]">
                Select a template that fits your style or upload your existing CV to get started instantly.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-[#111827]">Customize with AI</h3>
              <p className="text-[#6B7280]">
                Use our AI tools and drag-and-drop editor to personalize content, colors, and layout.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#10B981] to-[#34D399] rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-[#111827]">Publish & Share</h3>
              <p className="text-[#6B7280]">
                Publish your portfolio with one click and share your unique link with the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="templates" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-[#111827] mb-4">Beautiful Templates</h2>
            <p className="text-lg text-[#6B7280]">
              Professional designs crafted for every industry and style
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="border-[#E5E7EB] overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="aspect-[3/4] bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                  <div className="text-center space-y-2">
                    <LayoutTemplate className="w-12 h-12 text-[#4F46E5] mx-auto" />
                    <p className="text-sm font-medium text-[#6B7280]">Template {i}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button size="lg" variant="outline" className="border-[#4F46E5] text-[#4F46E5] hover:bg-[#EEF2FF]">
              View All Templates
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F9FAFB]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-[#111827] mb-4">Loved by Creators</h2>
            <p className="text-lg text-[#6B7280]">
              Join thousands of professionals showcasing their work
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-[#E5E7EB]">
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </div>
                <p className="text-[#6B7280] italic">
                  "Portfolium made it so easy to create a professional portfolio. The AI suggestions were spot on!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#4F46E5] to-[#6366F1] rounded-full"></div>
                  <div>
                    <p className="font-semibold text-[#111827]">Sarah Johnson</p>
                    <p className="text-sm text-[#6B7280]">UX Designer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB]">
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </div>
                <p className="text-[#6B7280] italic">
                  "I went from CV to published portfolio in under 10 minutes. Game changer for job hunting!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] rounded-full"></div>
                  <div>
                    <p className="font-semibold text-[#111827]">Michael Chen</p>
                    <p className="text-sm text-[#6B7280]">Software Engineer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB]">
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </div>
                <p className="text-[#6B7280] italic">
                  "The templates are beautiful and the customization options are endless. Highly recommend!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-[#34D399] rounded-full"></div>
                  <div>
                    <p className="font-semibold text-[#111827]">Emily Rodriguez</p>
                    <p className="text-sm text-[#6B7280]">Marketing Manager</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-[#111827] mb-4">Simple Pricing</h2>
            <p className="text-lg text-[#6B7280]">
              Start free and upgrade as you grow
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-[#E5E7EB]">
              <CardContent className="p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-[#111827] mb-2">Free</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[#111827]">$0</span>
                    <span className="text-[#6B7280]">/month</span>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span className="text-[#6B7280]">1 Portfolio</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span className="text-[#6B7280]">Basic Templates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span className="text-[#6B7280]">AI Assistant</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span className="text-[#6B7280]">Portfolium Subdomain</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full border-[#D1D5DB] hover:bg-[#F9FAFB]">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="border-[#4F46E5] border-2 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white border-0">
                  Most Popular
                </Badge>
              </div>
              <CardContent className="p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-[#111827] mb-2">Pro</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[#111827]">$12</span>
                    <span className="text-[#6B7280]">/month</span>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                    <span className="text-[#6B7280]">Unlimited Portfolios</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                    <span className="text-[#6B7280]">Premium Templates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                    <span className="text-[#6B7280]">Advanced AI Features</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                    <span className="text-[#6B7280]">Custom Domain</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                    <span className="text-[#6B7280]">Analytics Dashboard</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                    <span className="text-[#6B7280]">Priority Support</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-[#4F46E5] to-[#6366F1] hover:from-[#3730A3] hover:to-[#4F46E5] text-white">
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-[#4F46E5] to-[#6366F1] text-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">Start building your portfolio today</h2>
            <p className="text-xl text-white/90">
              Join thousands of professionals who trust Portfolium to showcase their work
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-[#4F46E5] hover:bg-white/90 h-12 px-8 text-base shadow-lg">
                Get Started — It's Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-[#E5E7EB] py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#4F46E5] to-[#6366F1] rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-xl text-[#111827]">Portfolium</span>
              </div>
              <p className="text-sm text-[#6B7280]">
                AI-powered portfolio builder for professionals
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#111827] mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-sm text-[#6B7280] hover:text-[#4F46E5] transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="text-sm text-[#6B7280] hover:text-[#4F46E5] transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#templates" className="text-sm text-[#6B7280] hover:text-[#4F46E5] transition-colors">
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-sm text-[#6B7280] hover:text-[#4F46E5] transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#111827] mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-[#6B7280] hover:text-[#4F46E5] transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-[#6B7280] hover:text-[#4F46E5] transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-[#6B7280] hover:text-[#4F46E5] transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#111827] mb-4">Account</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/auth/signin" className="text-sm text-[#6B7280] hover:text-[#4F46E5] transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup" className="text-sm text-[#6B7280] hover:text-[#4F46E5] transition-colors">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[#E5E7EB] text-center">
            <p className="text-sm text-[#6B7280]">
              © 2025 Portfolium. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
