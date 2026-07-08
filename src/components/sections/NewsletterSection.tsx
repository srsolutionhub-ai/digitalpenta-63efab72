import { useState } from "react";
import { motion } from "motion/react";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Newsletter signup — writes to newsletter_subscribers and triggers
 * a welcome email via the send-email edge function.
 */
export default function NewsletterSection({ variant = "full" }: { variant?: "full" | "inline" }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("newsletter_subscribers").insert({
        email: email.toLowerCase().trim(),
        name: name || null,
        source: "website",
      });
      if (error && !String(error.message).includes("duplicate")) throw error;

      // Fire welcome email (non-blocking failure)
      supabase.functions.invoke("send-email", {
        body: { template: "newsletter-welcome", to: email, data: { name } },
      }).catch(() => {});

      setDone(true);
      toast.success("Subscribed! Check your inbox.");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't subscribe. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  if (variant === "inline") {
    return (
      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2 max-w-md">
        <Input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white/5 border-white/10 h-11"
        />
        <Button type="submit" disabled={loading || done} className="rounded-xl h-11 px-5">
          {done ? <CheckCircle2 className="w-4 h-4" /> : loading ? "…" : <>Subscribe <ArrowRight className="w-4 h-4 ml-1" /></>}
        </Button>
      </form>
    );
  }

  return (
    <section className="py-16 md:py-24" aria-labelledby="newsletter-heading">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto rounded-3xl border border-white/10 p-8 md:p-12 overflow-hidden glass-card"
          style={{ background: "linear-gradient(135deg, hsl(256 90% 12% / 0.7), hsl(322 90% 14% / 0.7))" }}
        >
          <div aria-hidden className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none"
            style={{ background: "hsl(322 100% 60% / 0.3)" }} />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-white/5 border border-white/15 text-foreground/80">
                <Mail className="w-3 h-3 text-primary" /> Penta Insider · Weekly
              </span>
              <h2 id="newsletter-heading" className="mt-4 font-display font-extrabold text-3xl md:text-4xl leading-tight text-foreground">
                Growth playbooks in your inbox.
              </h2>
              <p className="mt-3 text-sm md:text-base text-muted-foreground">
                Join 2,400+ operators getting tactical SEO, paid media, and AI-marketing breakdowns every Tuesday. No fluff.
              </p>
            </div>
            <div>
              {done ? (
                <div className="rounded-2xl border border-primary/30 bg-primary/10 p-8 text-center">
                  <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-display font-bold text-foreground">You're in.</p>
                  <p className="text-xs text-muted-foreground mt-1">Welcome email on the way.</p>
                </div>
              ) : (
                <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-background/60 backdrop-blur-xl p-5 space-y-3">
                  <Input placeholder="First name (optional)" value={name} onChange={(e) => setName(e.target.value)} className="bg-white/5 border-white/10 h-11" />
                  <Input type="email" placeholder="Work email *" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-white/5 border-white/10 h-11" />
                  <Button type="submit" disabled={loading} size="lg" className="w-full btn-glow rounded-xl h-12 font-display font-bold text-sm gap-2 border-0 text-white hover:text-white">
                    {loading ? "Subscribing…" : "Subscribe"} <ArrowRight className="w-4 h-4" />
                  </Button>
                  <p className="text-[10px] text-center text-muted-foreground/80">🔒 Unsubscribe anytime.</p>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
