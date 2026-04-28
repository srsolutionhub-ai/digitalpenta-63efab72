import { Link } from "react-router-dom";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  PhoneCall,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * SignatureCtaSection
 * --------------------
 * The closing "spread" of the homepage — designed like a magazine back cover:
 *  - Oversized display headline
 *  - Editorial booking card with availability slots & direct call CTA
 *  - Guarantee strip with three risk-reversal pillars
 */

const slots = [
  { day: "Tue", date: "29", time: "11:00 AM IST", taken: false },
  { day: "Wed", date: "30", time: "3:30 PM IST", taken: false },
  { day: "Thu", date: "01", time: "10:00 AM IST", taken: true },
  { day: "Fri", date: "02", time: "5:00 PM IST", taken: false },
];

const guarantees = [
  {
    icon: ShieldCheck,
    title: "30-day pilot, no lock-in",
    body: "Test our team risk-free. Cancel anytime in the first month — no questions, no penalty.",
    glow: "hsl(162 100% 50%)",
  },
  {
    icon: Clock,
    title: "Reply within 4 working hours",
    body: "Real humans, no chatbots. Average response time across 2024 was 1h 47m.",
    glow: "hsl(192 95% 70%)",
  },
  {
    icon: Sparkles,
    title: "Senior strategists only",
    body: "Your account is led by a strategist with 8+ years' experience. No juniors on critical work.",
    glow: "hsl(322 90% 75%)",
  },
];

export default function SignatureCtaSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="book-strategy-call"
      className="relative overflow-hidden py-28 md:py-36"
      aria-labelledby="signature-cta-heading"
    >
      {/* Ambient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(70% 60% at 20% 30%, hsl(256 90% 30% / 0.22), transparent 65%), radial-gradient(60% 60% at 85% 80%, hsl(192 95% 35% / 0.18), transparent 65%), radial-gradient(50% 50% at 50% 100%, hsl(322 90% 35% / 0.14), transparent 70%)",
        }}
      />
      {/* Top neon hairline */}
      <div className="neon-divider absolute inset-x-0 top-0 opacity-60" />
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--foreground) / 0.5) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse at center, black 25%, transparent 75%)",
        }}
      />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left — Editorial copy */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="neon-chip mb-6">Book your slot</span>
            </motion.div>

            <motion.h2
              id="signature-cta-heading"
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-extrabold leading-[0.95] tracking-tighter text-foreground"
              style={{ fontSize: "clamp(2.25rem, 6vw, 5rem)" }}
            >
              Let's build the
              <br />
              <span className="text-gradient-hero">growth chapter</span>
              <br />
              your brand deserves.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl"
            >
              30 minutes with a senior strategist. We'll audit your funnel, model
              the realistic upside, and ship a custom growth plan within{" "}
              <span className="font-semibold text-foreground">72 hours</span> —
              whether you hire us or not.
            </motion.p>

            {/* Inline trust row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              {[
                "No sales pitch",
                "No obligations",
                "Custom plan in 72h",
              ].map((label) => (
                <span
                  key={label}
                  className="flex items-center gap-2 text-sm text-foreground/70"
                >
                  <CheckCircle2 className="h-4 w-4 text-[hsl(162_100%_50%)]" />
                  {label}
                </span>
              ))}
            </motion.div>

            {/* Direct line */}
            <motion.a
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              href="tel:+918860100039"
              className="group mt-10 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/[0.06]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(256_90%_62%)] to-[hsl(322_90%_62%)] text-white">
                <PhoneCall className="h-3.5 w-3.5" />
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/50">
                Or call directly
              </span>
              <span className="font-display font-bold text-foreground transition-transform group-hover:translate-x-0.5">
                +91 88601 00039
              </span>
            </motion.a>
          </div>

          {/* Right — Booking card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative lg:col-span-5"
          >
            <div className="glass-card-featured p-7 md:p-8">
              {/* Card header */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(256_90%_62%)] to-[hsl(192_95%_56%)] text-white shadow-lg shadow-[hsl(256_90%_62%/0.4)]">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-display text-base font-bold text-foreground">
                      Strategy Call
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                      30 min · Free · 1-on-1
                    </p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-[hsl(162_100%_50%/0.12)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[hsl(162_100%_55%)]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(162_100%_50%)] shadow-[0_0_8px_hsl(162_100%_50%)]" />
                  Available
                </span>
              </div>

              {/* Slot grid */}
              <p className="relative z-10 mt-6 mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
                Next available slots
              </p>
              <div className="relative z-10 grid grid-cols-2 gap-2.5">
                {slots.map((slot) => (
                  <button
                    key={`${slot.day}-${slot.date}`}
                    disabled={slot.taken}
                    className={`group relative flex flex-col items-start rounded-xl border px-3.5 py-3 text-left transition-all duration-300 ${
                      slot.taken
                        ? "cursor-not-allowed border-white/[0.04] bg-white/[0.015] opacity-50"
                        : "border-white/10 bg-white/[0.03] hover:border-[hsl(256_90%_62%/0.5)] hover:bg-[hsl(256_90%_62%/0.08)]"
                    }`}
                  >
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                        {slot.day}
                      </span>
                      <span className="font-display text-lg font-bold text-foreground">
                        {slot.date}
                      </span>
                    </div>
                    <span className="mt-0.5 text-xs text-foreground/70">
                      {slot.time}
                    </span>
                    {slot.taken && (
                      <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/35">
                        Booked
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* CTA */}
              <Link
                to="/contact"
                className="relative z-10 mt-6 block"
              >
                <Button
                  size="lg"
                  className="btn-glow group h-[56px] w-full rounded-2xl border-0 px-6 font-display text-base font-bold text-white hover:text-white"
                >
                  Reserve my slot
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <p className="relative z-10 mt-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/40">
                · Encrypted · GDPR/DPDP compliant ·
              </p>
            </div>
          </motion.div>
        </div>

        {/* Guarantee strip */}
        <div className="mt-20 grid gap-4 md:grid-cols-3 md:gap-5">
          {guarantees.map((g, i) => {
            const Icon = g.icon;
            return (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.55 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card-pro group p-6"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border transition-transform duration-500 group-hover:rotate-[6deg]"
                    style={{
                      borderColor: g.glow.replace(")", " / 0.4)"),
                      background: `radial-gradient(circle at 30% 30%, ${g.glow.replace(")", " / 0.18)")}, transparent 70%)`,
                      boxShadow: `0 0 24px -6px ${g.glow.replace(")", " / 0.4)")}`,
                    }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: g.glow }}
                      strokeWidth={1.8}
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">
                      {g.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {g.body}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
