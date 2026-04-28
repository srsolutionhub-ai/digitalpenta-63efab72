import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import heroMesh from "@/assets/hero-mesh-gradient.jpg";
import heroOrb from "@/assets/hero-orb.png";
import HeroKpiTicker from "@/components/ui/hero-kpi-ticker";

const clientLogos = ["Zomato", "Lenskart", "PharmEasy", "Vedantu", "CarDekho"];

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden grain"
    >
      {/* Layer 1: Mesh gradient image base */}
      <motion.div className="absolute inset-0" style={{ y, opacity }}>
        <img
          src={heroMesh}
          alt=""
          aria-hidden
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width={1920}
          height={1080}
          style={{ opacity: 0.55 }}
        />
        {/* Background gradient mesh (CSS) */}
        <div className="absolute inset-0 mesh-bg" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
      </motion.div>

      {/* Layer 2: Animated glowing orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(256 90% 62% / 0.4) 0%, transparent 70%)",
            animation: "orb-pulse 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-1/4 -right-40 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(192 95% 56% / 0.3) 0%, transparent 70%)",
            animation: "orb-pulse 10s ease-in-out infinite 2s",
          }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(322 90% 62% / 0.25) 0%, transparent 70%)",
            animation: "orb-pulse 12s ease-in-out infinite 4s",
          }}
        />
      </div>

      {/* Layer 3: Floating crystalline orb (right side, large screens) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 80 }}
        animate={loaded ? { opacity: 1, scale: 1, x: 0 } : {}}
        transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-[-80px] top-1/2 -translate-y-1/2 w-[480px] h-[480px] hidden xl:block pointer-events-none"
      >
        <img
          src={heroOrb}
          alt=""
          aria-hidden
          className="w-full h-full object-contain float-orb"
          style={{ filter: "drop-shadow(0 0 60px hsl(256 90% 62% / 0.5))" }}
        />
      </motion.div>

      {/* Layer 4: Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--foreground) / 0.4) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          opacity: 0.04,
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-[920px] mx-auto text-center">
          {/* Award badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-card mb-10 group cursor-default"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="type-label text-foreground/80">
              India's #1 AI-Powered Growth Studio · 2025
            </span>
            <Sparkles className="w-3 h-3 text-primary group-hover:rotate-12 transition-transform" />
          </motion.div>

          {/* H1 — oversized display */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-extrabold tracking-tighter leading-[0.95] mb-8"
            style={{ fontSize: "clamp(2.75rem, 7.5vw, 6.5rem)" }}
          >
            <span className="block text-foreground">Marketing that</span>
            <span className="block text-gradient-hero">moves needles.</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            We blend <span className="text-foreground font-semibold">SEO, performance ads, social, and AI automation</span> to grow brands 10× faster — across India and the Middle East.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/contact">
              <Button
                size="lg"
                className="btn-glow rounded-full px-9 h-[56px] font-display font-bold text-base gap-2.5 group border-0 text-white hover:text-white"
              >
                Get Free Strategy Audit
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 h-[56px] font-display font-semibold text-base bg-white/5 border-white/15 backdrop-blur-md hover:bg-white/10 hover:border-white/25"
              >
                View Case Studies
              </Button>
            </Link>
          </motion.div>

          {/* Live KPI scoreboard */}
          <HeroKpiTicker />

          {/* Social proof row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.95 }}
            className="mt-12 flex flex-col items-center gap-5"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-mono">
                <span className="text-foreground font-bold">4.9</span> · 500+ brands · ₹10Cr+ revenue generated
              </span>
            </div>
            <div className="flex items-center justify-center gap-x-10 gap-y-3 flex-wrap opacity-60">
              {clientLogos.map((name) => (
                <span
                  key={name}
                  className="text-sm font-mono text-muted-foreground uppercase tracking-[0.2em]"
                >
                  {name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 rounded-full border border-foreground/20 flex items-start justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-2 rounded-full bg-gradient-to-b from-primary to-accent"
          />
        </div>
      </motion.div>
    </section>
  );
}
