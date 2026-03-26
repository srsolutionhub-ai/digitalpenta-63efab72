import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-accent/5 blur-[100px]" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground) / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.1) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="container mx-auto px-4 pt-20 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
              Trusted by 500+ brands across 12+ countries
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight mb-6">
            Five Powers.
            <br />
            <span className="text-gradient">Infinite Possibilities.</span>
          </h1>

          {/* Sub */}
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            We unite Digital Marketing, PR, Development, AI & Automation into one seamless force — 
            driving exponential growth for brands across India and the Middle East.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/get-proposal">
              <Button size="lg" className="rounded-full px-8 font-display font-semibold gap-2 group">
                Get Your Free Proposal
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button variant="outline" size="lg" className="rounded-full px-8 font-display font-semibold gap-2 border-border/60 hover:border-primary/40">
                <Play className="w-4 h-4" />
                View Our Work
              </Button>
            </Link>
          </div>

          {/* Trust */}
          <div className="mt-16 flex items-center justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full bg-secondary border-2 border-background flex items-center justify-center">
                    <span className="text-[8px] font-bold text-secondary-foreground">{i}</span>
                  </div>
                ))}
              </div>
              <span className="text-xs">4.9★ on Clutch</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <span className="hidden sm:inline text-xs">Google Partner</span>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <span className="hidden sm:inline text-xs">Meta Partner</span>
          </div>
        </div>
      </div>
    </section>
  );
}
