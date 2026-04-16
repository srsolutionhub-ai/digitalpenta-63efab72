import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import heroBanner from "@/assets/hero-banner-graphic.jpg";

const clientLogos = ["Zomato", "Lenskart", "PharmEasy", "Vedantu", "CarDekho"];

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Premium background graphic */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Digital marketing growth visualization"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width={1920}
          height={800}
          style={{ opacity: 0.35 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </div>

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--foreground) / 0.35) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          opacity: 0.03,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-[900px] mx-auto text-center">
          {/* Trust badge pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full card-surface mb-10"
          >
            <span className="text-sm">⭐</span>
            <span className="type-label text-muted-foreground">
              Trusted by 500+ brands across India & Middle East
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="type-hero text-foreground mb-6"
          >
            India's most{" "}
            <span className="text-gradient">results-driven</span>
            <br />
            digital marketing agency
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-[20px] text-muted-foreground mb-10"
          >
            SEO · Google Ads · Social Media · AI Automation — all under one roof.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-5 mb-16"
          >
            <Link to="/contact">
              <Button
                size="lg"
                className="rounded-full px-10 h-[52px] font-display font-bold text-base gap-2.5 group"
              >
                Get Free Strategy Audit
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a
              href="#results"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              See client results ↓
            </a>
          </motion.div>

          {/* Client logos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex items-center justify-center gap-10 flex-wrap"
          >
            {clientLogos.map((name) => (
              <span
                key={name}
                className="text-sm font-mono text-muted-foreground/50 uppercase tracking-widest"
              >
                {name}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
