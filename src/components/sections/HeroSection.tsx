import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

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
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 text-primary whitespace-nowrap"
        >
          {switcherWords[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="container mx-auto px-4 pt-32 pb-28 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full card-surface mb-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="type-label text-muted-foreground">
              Trusted by 100+ brands across India & Middle East
            </span>
          </motion.div>

          <h1 className="font-display type-hero text-foreground mb-8">
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              India's Most Results-Driven
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="block text-primary mt-1"
            >
              Digital Marketing Agency
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="type-body max-w-xl mb-5"
          >
            We help brands dominate Google, Instagram & Meta — with data-driven
            campaigns <TextSwitcher /> that convert visitors into paying customers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-start gap-4 mb-14"
          >
            <Link to="/contact">
              <Button size="lg" className="rounded-full px-10 py-6 font-display font-bold text-base gap-2.5 group">
                Get Free Audit
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button variant="outline" size="lg" className="rounded-full px-10 py-6 font-display font-semibold text-base gap-2.5">
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
            {["100+ Clients", "₹10Cr+ Revenue", "95% Retention", "5 Years"].map((text) => (
              <span key={text} className="type-label text-muted-foreground px-4 py-2 rounded-full card-surface font-mono">
                {text}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
