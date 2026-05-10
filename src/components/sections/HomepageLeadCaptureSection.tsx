import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Always-available inline lead capture widget for the homepage.
 * Does NOT use the overlay orchestrator slot — it's an in-page section,
 * which means it never collides with cookie/exit/lead-bar overlays.
 */
export default function HomepageLeadCaptureSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || !name) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("contacts").insert({
        name,
        email,
        phone: phone || null,
        message: "Homepage premium lead widget — requested free 30-min strategy call.",
        source: "homepage-lead-widget",
      });
      if (error) throw error;
      setDone(true);
      toast.success("We'll reach out within 1 business hour.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="get-started"
      className="relative py-16 md:py-24"
      aria-labelledby="lead-widget-heading"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden border border-white/10 glass-card p-8 md:p-12"
          style={{
            background:
              "linear-gradient(135deg, hsl(256 90% 12% / 0.85) 0%, hsl(322 90% 14% / 0.85) 100%)",
          }}
        >
          {/* Decorative glow */}
          <div
            aria-hidden
            className="absolute -top-32 -right-24 w-[420px] h-[420px] rounded-full blur-[120px] pointer-events-none"
            style={{ background: "hsl(256 100% 60% / 0.35)" }}
          />
          <div
            aria-hidden
            className="absolute -bottom-32 -left-24 w-[380px] h-[380px] rounded-full blur-[120px] pointer-events-none"
            style={{ background: "hsl(192 100% 55% / 0.25)" }}
          />

          <div className="relative grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Copy */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-white/5 border border-white/15 text-foreground/80">
                <Sparkles className="w-3 h-3 text-primary" /> Free 30-min strategy call
              </span>
              <h2
                id="lead-widget-heading"
                className="mt-4 font-display font-extrabold text-3xl md:text-4xl leading-[1.05] text-foreground"
              >
                Get a custom growth plan{" "}
                <span className="text-gradient-hero">in 24 hours.</span>
              </h2>
              <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-md">
                Tell us where you want to grow. Our strategists send back a
                tailored audit + funnel — no obligation, no fluff.
              </p>
              <ul className="mt-5 space-y-2">
                {[
                  "Free SEO + Ads audit (worth ₹25,000)",
                  "Competitor breakdown & opportunity map",
                  "Custom funnel + 90-day roadmap",
                ].map((b) => (
                  <li key={b} className="flex items-center gap-2 text-xs md:text-sm text-foreground/85">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Form */}
            <div>
              {done ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-primary/30 bg-primary/10 p-8 text-center"
                >
                  <div className="text-4xl mb-2">🎉</div>
                  <h3 className="font-display font-bold text-lg text-foreground">You're in.</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    A growth strategist will reach out within 1 business hour.
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={submit}
                  className="rounded-2xl border border-white/10 bg-background/60 backdrop-blur-xl p-5 md:p-6 space-y-3"
                >
                  <Input
                    placeholder="Your name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 h-11"
                    autoComplete="name"
                  />
                  <Input
                    type="email"
                    placeholder="Work email *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 h-11"
                    autoComplete="email"
                  />
                  <Input
                    type="tel"
                    placeholder="Phone / WhatsApp (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-white/5 border-white/10 h-11"
                    autoComplete="tel"
                  />
                  <Button
                    type="submit"
                    disabled={submitting}
                    size="lg"
                    className="w-full btn-glow rounded-xl h-12 font-display font-bold text-sm gap-2 border-0 text-white hover:text-white"
                  >
                    {submitting ? "Sending…" : "Get my free plan"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <p className="text-[10px] text-center text-muted-foreground/80">
                    🔒 We respect privacy. No spam. Unsubscribe anytime.
                  </p>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
