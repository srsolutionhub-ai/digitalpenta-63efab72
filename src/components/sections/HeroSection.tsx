import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import ParticleField from "@/components/ui/particle-field";
import ScrollIndicator from "@/components/ui/scroll-indicator";
import { motion, AnimatePresence } from "motion/react";
import heroBg from "@/assets/hero-bg.jpg";

const switcherWords = ["For Real Estate", "For Healthcare", "For Ecommerce", "For SaaS", "For D2C"];

function TextSwitcher() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setIndex((i) => (i + 1) % switcherWords.length), 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-block relative min-w-[220px] sm:min-w-[320px] h-[1.2em] align-bottom overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={switcherWords[index]}
          initial={{ y: 40, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -40, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 text-gradient whitespace-nowrap"
        >
          {switcherWords[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* Floating keyword tags behind hero */
const floatingTags = ["₹ROI", "#Growth", "SEO", "Ads", "Leads", "#Digital", "ROAS", "CTR"];

/* Abstract geometric orbit illustration */
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
      <motion.circle cx="250" cy="250" r="180" stroke="hsl(256, 90%, 60%)" strokeWidth="0.5" strokeDasharray="6 6" opacity="0.2"
        initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "250px 250px" }}
      />
      <motion.circle cx="250" cy="250" r="130" stroke="hsl(162, 100%, 42%)" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.15"
        initial={{ rotate: 0 }} animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "250px 250px" }}
      />
      <motion.circle cx="250" cy="250" r="80" stroke="hsl(256, 90%, 60%)" strokeWidth="0.5" opacity="0.1"
        initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "250px 250px" }}
      />
      <circle cx="250" cy="250" r="8" fill="hsl(256, 90%, 60%)" opacity="0.6" />
      <circle cx="250" cy="250" r="3" fill="hsl(162, 100%, 42%)" />
      {[
        { cx: 430, cy: 250, color: "hsl(256, 90%, 60%)", r: 6 },
        { cx: 306, cy: 420, color: "hsl(162, 100%, 42%)", r: 5 },
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
    </motion.svg>
  );
}

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
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

      {/* Floating keyword tags */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {floatingTags.map((tag, i) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 + i * 0.2, duration: 0.6 }}
            className="absolute text-[10px] font-mono text-foreground/[0.15] px-3 py-1.5 rounded-full border border-primary/[0.08] bg-primary/[0.03] backdrop-blur-sm"
            style={{
              left: `${10 + (i * 12) % 80}%`,
              top: `${15 + (i * 17) % 65}%`,
              animation: `float ${5 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.7}s`,
            }}
          >
            {tag}
          </motion.span>
        ))}
      </div>

      {/* Breathing gradient orbs */}
      <div className="absolute top-[15%] right-[10%] w-[500px] h-[500px] rounded-full bg-primary/8 blur-[150px] animate-breathe" />
      <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-accent/6 blur-[130px] animate-breathe-slow" />
      <div className="absolute top-[60%] right-[40%] w-[300px] h-[300px] rounded-full bg-glow-violet/5 blur-[100px] animate-pulse-glow" />

      <div className="absolute inset-0 mesh-gradient animated-gradient-bg" />

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
                Trusted by 100+ brands across India & Middle East
              </span>
            </motion.div>

            <h1
              className="font-display font-extrabold leading-[0.95] tracking-tight mb-8"
              style={{ fontSize: "clamp(2.2rem, 5.5vw, 5rem)" }}
            >
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="block text-foreground"
              >
                India's Most Results-Driven
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="block text-gradient mt-1"
              >
                Digital Marketing Agency
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-muted-foreground text-base md:text-lg max-w-xl leading-relaxed mb-5"
            >
              We help brands dominate Google, Instagram & Meta — with data-driven
              campaigns <TextSwitcher /> that convert visitors into paying customers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-start gap-4 mb-10"
            >
              <Link to="/contact">
                <Button size="lg" className="rounded-full px-10 py-6 font-display font-bold text-base gap-2.5 group bg-gradient-to-r from-[hsl(20,90%,50%)] to-[hsl(30,100%,45%)] hover:opacity-90 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 hover:scale-[1.02]">
                  🚀 Get Free Audit
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/portfolio">
                <Button variant="outline" size="lg" className="rounded-full px-10 py-6 font-display font-semibold text-base gap-2.5 border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300">
                  <Play className="w-4 h-4" />
                  See Our Results
                </Button>
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4"
            >
              {[
                { text: "100+ Clients", color: "border-primary/20 bg-primary/5" },
                { text: "₹10Cr+ Revenue", color: "border-accent/20 bg-accent/5" },
                { text: "95% Retention", color: "border-amber-500/20 bg-amber-500/5" },
                { text: "5 Years", color: "border-primary/20 bg-primary/5" },
              ].map((badge) => (
                <span key={badge.text} className={`text-xs font-mono text-foreground/70 px-4 py-2 rounded-full border ${badge.color} hover-glow transition-all duration-300`}>
                  {badge.text}
                </span>
              ))}
            </motion.div>
          </div>

          <div className="hidden lg:block w-[420px] xl:w-[480px] flex-shrink-0">
            <HeroIllustration />
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
