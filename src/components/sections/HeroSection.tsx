import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute top-[15%] right-[10%] w-[500px] h-[500px] rounded-full bg-primary/8 blur-[150px] animate-[float_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-accent/6 blur-[130px] animate-[float_10s_ease-in-out_infinite_reverse]" />
      <div className="absolute top-[60%] right-[40%] w-[300px] h-[300px] rounded-full bg-glow-violet/5 blur-[100px] animate-[pulse-glow_6s_ease-in-out_infinite]" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground) / 0.08) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.08) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")` }} />

      <div className="container mx-auto px-4 pt-28 pb-20 relative z-10">
        <div className="max-w-5xl">
          {/* Eyebrow */}
          <div
            className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass border border-border/30 mb-10 transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] font-mono text-muted-foreground tracking-wider uppercase">
              Trusted by 500+ brands across 12+ countries
            </span>
          </div>

          {/* Headline — oversized, left-aligned */}
          <h1
            className={`font-display font-extrabold leading-[0.95] tracking-tight mb-8 transition-all duration-1000 delay-200 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ fontSize: "clamp(2.75rem, 7vw, 6.5rem)" }}
          >
            <span className="block text-foreground">Five Powers.</span>
            <span className="block text-gradient mt-1">Infinite Possibilities.</span>
          </h1>

          {/* Sub — left-aligned, max-width */}
          <p
            className={`text-muted-foreground text-base md:text-lg max-w-xl leading-relaxed mb-12 transition-all duration-1000 delay-400 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            We unite Digital Marketing, PR, Development, AI & Automation into one seamless force — 
            driving exponential growth for brands across India and the Middle East.
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row items-start gap-4 transition-all duration-1000 delay-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <Link to="/get-proposal">
              <Button size="lg" className="rounded-full px-10 py-6 font-display font-bold text-base gap-2.5 group shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
                Get Your Free Proposal
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button variant="outline" size="lg" className="rounded-full px-10 py-6 font-display font-semibold text-base gap-2.5 border-border/40 hover:border-primary/40 hover:bg-primary/5">
                <Play className="w-4 h-4" />
                View Our Work
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div
            className={`mt-20 flex items-center gap-8 transition-all duration-1000 delay-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["#6C63FF", "#00D4FF", "#10B981", "#F59E0B"].map((c, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center"
                    style={{ backgroundColor: `${c}22`, borderColor: `${c}44` }}
                  >
                    <span className="text-[9px] font-bold" style={{ color: c }}>★</span>
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-sm font-display font-semibold text-foreground">4.9/5</p>
                <p className="text-[10px] text-muted-foreground font-mono">on Clutch</p>
              </div>
            </div>
            <div className="w-px h-8 bg-border/50" />
            <div>
              <p className="text-sm font-display font-medium text-foreground">Google Partner</p>
              <p className="text-[10px] text-muted-foreground font-mono">Premier Certified</p>
            </div>
            <div className="hidden sm:block w-px h-8 bg-border/50" />
            <div className="hidden sm:block">
              <p className="text-sm font-display font-medium text-foreground">Meta Partner</p>
              <p className="text-[10px] text-muted-foreground font-mono">Business Partner</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
