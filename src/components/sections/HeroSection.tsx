import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import ParticleField from "@/components/ui/particle-field";
import { motion } from "motion/react";
import heroBg from "@/assets/hero-bg.jpg";

/* Abstract geometric node illustration — interconnected orbits */
function HeroIllustration() {
  return (
    <motion.svg
      viewBox="0 0 500 500"
      className="w-full h-full"
      fill="none"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.circle cx="250" cy="250" r="180" stroke="hsl(252, 60%, 63%)" strokeWidth="0.5" strokeDasharray="6 6" opacity="0.2"
        initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "250px 250px" }}
      />
      <motion.circle cx="250" cy="250" r="130" stroke="hsl(190, 100%, 50%)" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.15"
        initial={{ rotate: 0 }} animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "250px 250px" }}
      />
      <motion.circle cx="250" cy="250" r="80" stroke="hsl(252, 60%, 63%)" strokeWidth="0.5" opacity="0.1"
        initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "250px 250px" }}
      />
      <circle cx="250" cy="250" r="8" fill="hsl(252, 60%, 63%)" opacity="0.6" />
      <circle cx="250" cy="250" r="3" fill="hsl(190, 100%, 50%)" />
      {[
        { cx: 430, cy: 250, color: "hsl(252, 60%, 63%)", r: 6 },
        { cx: 306, cy: 420, color: "hsl(190, 100%, 50%)", r: 5 },
        { cx: 139, cy: 370, color: "hsl(160, 84%, 39%)", r: 5 },
        { cx: 139, cy: 130, color: "hsl(38, 92%, 50%)", r: 5 },
        { cx: 306, cy: 80, color: "hsl(20, 90%, 55%)", r: 5 },
      ].map((node, i) => (
        <g key={i}>
          <line x1="250" y1="250" x2={node.cx} y2={node.cy} stroke={node.color} strokeWidth="0.5" opacity="0.15" />
          <motion.circle
            cx={node.cx} cy={node.cy} r={node.r} fill={node.color} opacity="0.7"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 3, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle cx={node.cx} cy={node.cy} r={node.r + 10} stroke={node.color} strokeWidth="0.3" opacity="0.1" />
        </g>
      ))}
      <motion.polygon points="250,60 280,77 280,111 250,128 220,111 220,77" stroke="hsl(252, 60%, 63%)" strokeWidth="0.5" opacity="0.06" fill="none"
        animate={{ rotate: [0, 60] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "250px 94px" }}
      />
      {[
        { x: 170, y: 190 }, { x: 330, y: 310 }, { x: 380, y: 170 },
        { x: 120, y: 280 }, { x: 290, y: 180 }, { x: 200, y: 350 },
      ].map((d, i) => (
        <motion.circle
          key={i} cx={d.x} cy={d.y} r="1.5" fill="hsl(var(--foreground))" opacity="0.1"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </motion.svg>
  );
}

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const headlineWords = ["Five", "Powers."];
  const subHeadlineWords = ["Infinite", "Possibilities."];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <img
        src={heroBg}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />

      <ParticleField count={25} />

      {/* Breathing gradient orbs */}
      <div className="absolute top-[15%] right-[10%] w-[500px] h-[500px] rounded-full bg-primary/8 blur-[150px] animate-breathe" />
      <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-accent/6 blur-[130px] animate-breathe-slow" />
      <div className="absolute top-[60%] right-[40%] w-[300px] h-[300px] rounded-full bg-glow-violet/5 blur-[100px] animate-pulse-glow" />

      <div className="absolute inset-0 mesh-gradient" />

      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground) / 0.08) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.08) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="container mx-auto px-4 pt-28 pb-20 relative z-10">
        <div className="flex items-center gap-12 lg:gap-20">
          <div className="max-w-3xl flex-1">
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

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-muted-foreground text-base md:text-lg max-w-xl leading-relaxed mb-12"
            >
              We unite Digital Marketing, PR, Development, AI & Automation into one seamless force — 
              driving exponential growth for brands across India and the Middle East.
            </motion.p>

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

          <div className="hidden lg:block w-[420px] xl:w-[480px] flex-shrink-0">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}
