import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import ParticleField from "@/components/ui/particle-field";
import { motion } from "motion/react";

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const headlineWords = ["Five", "Powers."];
  const subHeadlineWords = ["Infinite", "Possibilities."];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Particle field */}
      <ParticleField count={25} />

      {/* Breathing gradient orbs */}
      <div className="absolute top-[15%] right-[10%] w-[500px] h-[500px] rounded-full bg-primary/8 blur-[150px] animate-breathe" />
      <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-accent/6 blur-[130px] animate-breathe-slow" />
      <div className="absolute top-[60%] right-[40%] w-[300px] h-[300px] rounded-full bg-glow-violet/5 blur-[100px] animate-pulse-glow" />

      {/* Mesh */}
      <div className="absolute inset-0 mesh-gradient" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground) / 0.08) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.08) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Decorative SVG — circuit pattern */}
      <svg className="absolute top-20 right-[5%] w-[300px] h-[300px] opacity-[0.04]" viewBox="0 0 300 300" fill="none">
        <circle cx="50" cy="50" r="4" fill="hsl(var(--primary))" />
        <circle cx="150" cy="100" r="4" fill="hsl(var(--accent))" />
        <circle cx="250" cy="50" r="4" fill="hsl(var(--primary))" />
        <circle cx="100" cy="200" r="4" fill="hsl(var(--accent))" />
        <circle cx="200" cy="250" r="4" fill="hsl(var(--primary))" />
        <line x1="50" y1="50" x2="150" y2="100" stroke="hsl(var(--primary))" strokeWidth="1" />
        <line x1="150" y1="100" x2="250" y2="50" stroke="hsl(var(--accent))" strokeWidth="1" />
        <line x1="150" y1="100" x2="100" y2="200" stroke="hsl(var(--primary))" strokeWidth="1" />
        <line x1="100" y1="200" x2="200" y2="250" stroke="hsl(var(--accent))" strokeWidth="1" />
      </svg>

      <div className="container mx-auto px-4 pt-28 pb-20 relative z-10">
        <div className="max-w-5xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass border border-border/30 mb-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] font-mono text-muted-foreground tracking-wider uppercase">
              Trusted by 500+ brands across 12+ countries
            </span>
          </motion.div>

          {/* Headline — staggered word reveal */}
          <h1
            className="font-display font-extrabold leading-[0.95] tracking-tight mb-8"
            style={{ fontSize: "clamp(2.75rem, 7vw, 6.5rem)" }}
          >
            <span className="block text-foreground">
              {headlineWords.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 40 }}
                  animate={loaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block mr-[0.25em]"
                >
                  {word}
                </motion.span>
              ))}
            </span>
            <span className="block text-gradient mt-1">
              {subHeadlineWords.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 40 }}
                  animate={loaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block mr-[0.25em]"
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-muted-foreground text-base md:text-lg max-w-xl leading-relaxed mb-12"
          >
            We unite Digital Marketing, PR, Development, AI & Automation into one seamless force — 
            driving exponential growth for brands across India and the Middle East.
          </motion.p>

          {/* CTAs with animated border */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <Link to="/get-proposal">
              <Button size="lg" className="rounded-full px-10 py-6 font-display font-bold text-base gap-2.5 group shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02]">
                Get Your Free Proposal
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button variant="outline" size="lg" className="rounded-full px-10 py-6 font-display font-semibold text-base gap-2.5 border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300">
                <Play className="w-4 h-4" />
                View Our Work
              </Button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20 flex items-center gap-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["hsl(var(--primary))", "hsl(var(--accent))", "hsl(160, 84%, 39%)", "hsl(38, 92%, 50%)"].map((c, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center"
                    style={{ backgroundColor: `${c.replace(")", " / 0.15)")}`, borderColor: `${c.replace(")", " / 0.3)")}` }}
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
