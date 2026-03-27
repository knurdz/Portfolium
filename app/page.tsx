"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Layers, 
  Sparkles, 
  Orbit, 
  Rocket, 
  Zap,
} from "lucide-react";

const FillButton = ({ href, children, isPrimary = false, className = "" }: { href: string; children: React.ReactNode; isPrimary?: boolean; className?: string }) => (
  <Link 
    href={href} 
    className={`group relative inline-flex items-center justify-center overflow-hidden rounded-xl border px-8 font-medium transition-colors ${ 
      isPrimary 
        ? "border-violet-600 text-violet-700 dark:text-violet-400 dark:border-violet-500" 
        : "border-border text-foreground hover:border-foreground/50" 
    } ${className} h-12`}
  >
    <span className="absolute inset-0 -z-10 flex h-full w-full items-center justify-center">
      <span className={`absolute h-full w-0 transition-all duration-300 ease-out group-hover:w-full ${ 
        isPrimary ? "bg-violet-500 dark:bg-violet-600" : "bg-foreground"
      }`} />
    </span>
    <span className={`relative z-10 transition-colors duration-300 flex items-center gap-2 ${
      isPrimary ? "group-hover:text-white" : "group-hover:text-background"
    }`}>
      {children}
    </span>
  </Link>
);

export default function Home() {
  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="relative min-h-[100dvh] text-foreground flex flex-col font-sans selection:bg-violet-500/30 overflow-x-hidden">
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
        {/* Subtle horizon glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-violet-500/10 via-transparent to-transparent pointer-events-none z-0 mix-blend-screen" />
      </div>

      {/* HEADER */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 w-full pointer-events-none">
        <header className="w-full max-w-5xl rounded-full border border-violet-500/30 dark:border-white/10 bg-background/60 backdrop-blur-xl shadow-[0_0_15px_rgba(139,92,246,0.15)] dark:shadow-none pointer-events-auto transition-all duration-300">
          <div className="px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="#" onClick={scrollToTop} className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-md shadow-violet-500/20">
                <Layers className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span className="font-bold text-lg md:text-xl tracking-tight text-foreground">Portfolium</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 px-2 py-1 rounded-full bg-muted/40 border border-violet-500/30 dark:border-white/10 shadow-[0_0_15px_rgba(139,92,246,0.15)] dark:shadow-none">
              <Link href="#features" className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background/80 rounded-full transition-all">Features</Link>
              <Link href="#templates" className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background/80 rounded-full transition-all">Templates</Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <div className="scale-90 md:scale-100">
                <ThemeToggle />
              </div>
              <Link 
                href="/auth/signin" 
                className="text-sm font-semibold px-4 md:px-5 py-2 rounded-full bg-foreground text-background hover:bg-violet-600 hover:scale-105 active:scale-95 transition-all shadow-sm"
              >
                Log in
              </Link>
            </div>
          </div>
        </header>
      </div>

      {/* HERO SECTION - Left Box Split */}
      <main className="flex-1 mt-16 md:mt-20">
        <section className="relative pt-20 pb-32 overflow-hidden">
          {/* Ambient Background Glow (No Grid) */}
          <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
            {/* Ambient glow centers */}
            <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[600px] h-[600px] bg-violet-500/15 dark:bg-violet-500/20 rounded-full pointer-events-none blur-[100px]" />
            <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/15 dark:bg-purple-500/20 rounded-full pointer-events-none blur-[100px]" />
          </div>

          <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side: Name and Description */}
            <div className="flex flex-col items-start text-left space-y-8 z-10 w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300 text-sm font-medium">
                <Sparkles className="w-4 h-4" /> Portfolium 2.0 is live
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Developer Portfolios, Built Differently.
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Stop wrestling with CSS. We instantly generate, customize, and deploy stunning developer portfolios with zero design skills required.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <FillButton href="/auth/signup" isPrimary={true}>
                  Start Building Free
                </FillButton>
                <FillButton href="#features">
                  Explore Features
                </FillButton>
              </div>
              
              <div className="flex items-center gap-4 pt-8 text-sm text-muted-foreground font-medium">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 15}`} alt="user" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-border border-2 border-background flex items-center justify-center text-xs">+</div>
                </div>
                <span>Joined by 1,000+ developers</span>
              </div>
            </div>

            {/* Right Side: Visual Graphic Content */}
            <div className="relative w-full h-[500px] hidden lg:block z-10 lg:pl-10">
              {/* Backdrop Mockup Window */}
                <div className="absolute top-4 right-0 w-[90%] h-[420px] bg-card border border-violet-500/30 dark:border-white/10 shadow-[0_0_20px_rgba(139,92,246,0.15)] dark:shadow-2xl rounded-2xl overflow-hidden">
                <div className="h-12 border-b border-border bg-muted/30 flex items-center px-4 justify-between">
                   <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                     <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                   </div>
                   <div className="text-xs text-muted-foreground font-mono opacity-60">portfolium.sh/app</div>
                </div>
                {/* Mockup Body Content */}
                <div className="p-8 h-full bg-gradient-to-br from-card to-muted/20 animate-[pulse_4s_ease-in-out_infinite]">
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-muted border border-border flex shrink-0 items-center justify-center overflow-hidden shadow-inner">
                       <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Main" alt="avatar" className="w-full h-full object-cover"/>
                    </div>
                    <div className="flex-1 space-y-4 pt-1">
                      <div className="w-2/3 h-5 bg-muted rounded"></div>
                      <div className="w-1/2 h-3 bg-muted/50 rounded"></div>
                      <div className="flex gap-2 pt-2">
                        <div className="w-16 h-6 bg-violet-500/10 rounded border border-violet-500/20"></div>
                        <div className="w-16 h-6 bg-violet-500/10 rounded border border-violet-500/20"></div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-10">
                     <div className="h-28 bg-background rounded-xl border border-border/50 shadow-sm p-4 flex flex-col justify-end space-y-2">
                         <div className="w-8 h-8 rounded bg-muted"></div>
                         <div className="w-3/4 h-3 bg-muted/80 rounded"></div>
                     </div>
                     <div className="h-28 bg-background rounded-xl border border-border/50 shadow-sm p-4 flex flex-col justify-end space-y-2">
                         <div className="w-8 h-8 rounded bg-muted"></div>
                         <div className="w-3/4 h-3 bg-muted/80 rounded"></div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Overlapping Floating Element */}
                <div className="absolute bottom-8 left-0 w-[300px] p-6 bg-background/90 backdrop-blur-xl border border-violet-500/30 dark:border-white/10 shadow-[0_0_20px_rgba(139,92,246,0.15)] dark:shadow-xl rounded-2xl transform transition-transform hover:-translate-y-2 duration-500">
                 <div className="flex items-center gap-4 mb-5">
                   <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-500">
                     <Orbit className="w-6 h-6" />
                   </div>
                   <div>
                     <div className="text-sm font-bold">Theme Successfully Applied</div>
                     <div className="text-xs text-muted-foreground mt-1">Minimalist Developer UI</div>
                   </div>
                 </div>
                 <div className="flex gap-2">
                    <div className="flex-1 h-9 bg-violet-600 rounded-lg flex items-center justify-center text-white text-xs font-semibold shadow-md">
                      Live Preview ✓
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Spacer */}
        <div className="h-32 md:h-48 relative z-0"></div>

        {/* FEATURES SECTION */}
        <section id="features" className="py-24 bg-white dark:bg-background relative z-10 border-y border-border scroll-m-20">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Everything you need to stand out</h2>
              <p className="text-lg text-muted-foreground">Focus on your shipping and coding. We automate the presentation so you can show off your best work.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <Layers className="w-6 h-6" />, title: "Beautiful Templates", desc: "Choose from dozens of professionally designed themes. Customize colors and typography instantly." },
                { icon: <Zap className="w-6 h-6" />, title: "Lightning Fast", desc: "Static generation and global edge caching ensures your portfolio loads instantly anywhere." },
                { icon: <Rocket className="w-6 h-6" />, title: "Custom Domains", desc: "Bring your own domain or use our free .portfolium subdomain. SSL certificates included by default." },
              ].map((feature) => (
                <div key={feature.title} className="group p-8 rounded-3xl border border-border bg-card/50 hover:bg-card hover:border-violet-500/30 transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Spacer */}
        <div className="h-32 md:h-48 relative z-0"></div>

        {/* TEMPLATES SECTION */}
        <section id="templates" className="py-24 bg-white dark:bg-background relative z-10 scroll-m-20 border-y border-border">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
              <div className="max-w-2xl">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">Curated Designer Themes</h2>
                <p className="text-lg text-muted-foreground">Start with a stunning template designed for conversion. Switch them with a single click without rebuilding your data.</p>
              </div>
              <FillButton href="/auth/signup" className="shrink-0 h-10 px-6">
                Browse All
              </FillButton>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Animated Modern", cat: "Creative & Interactive", img: "/templates/animated.png" },
                { name: "Software Engineer", cat: "Teck & Development", img: "/templates/developer.png" },
                { name: "3D Perspective", cat: "Innovative Design", img: "/templates/3d.png" },
              ].map((theme) => (
                <div key={theme.name} className="group relative rounded-3xl overflow-hidden border border-border bg-card hover:border-violet-500/30 transition-all duration-300">
                   <div className={`aspect-[16/10] relative overflow-hidden border-b border-border`}>
                      <img 
                        src={theme.img} 
                        alt={theme.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4 px-3 py-1 bg-background/80 backdrop-blur rounded-full text-xs font-semibold">
                         Free
                      </div>
                   </div>
                   <div className="p-6">
                      <h3 className="font-bold text-lg mb-1">{theme.name}</h3>
                      <p className="text-sm text-muted-foreground">{theme.cat}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Spacer */}
        <div className="h-32 md:h-48 relative z-0"></div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-border bg-background relative overflow-hidden">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6">
            
            {/* Left Side: Navigation Links & Copyright */}
            <div className="flex flex-col items-center md:items-start gap-3 w-full md:w-auto">
              <nav className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-sm font-medium text-muted-foreground w-full">
                <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
                <Link href="#templates" className="hover:text-foreground transition-colors">Templates</Link>
              </nav>
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} Portfolium. All rights reserved.
              </p>
            </div>

            {/* Right Side: Logo & Powered By */}
            <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight">Portfolium</span>
                <div className="w-6 h-6 rounded-lg bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
                  <Layers className="w-3 h-3" />
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/50 bg-muted/30 text-xs font-medium text-muted-foreground">
                Powered by <Zap className="w-3 h-3 text-amber-500 fill-amber-500" /> 
                <Link href="https://knurdz.org/" target="_blank" className="text-foreground hover:text-violet-500 transition-colors">Knurdz</Link>
              </div>
            </div>
            
          </div>
        </div>
      </footer>

    </div>
  );
}
