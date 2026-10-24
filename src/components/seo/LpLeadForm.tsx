import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { submitLead, LeadError } from "@/lib/submitLead";

/**
 * Compact inline lead-capture form for /lp/ keyword landing pages.
 * Submits through the same `submit-lead` pipeline as the contact form
 * (validation, spam checks, AI scoring, routing) so every landing page
 * is a real lead-capture point, not just a brochure.
 */
export default function LpLeadForm({ service, slug }: { service: string; slug: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const startedAt = useRef(Date.now());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const get = (n: string) => (form.querySelector(`[name="${n}"]`) as HTMLInputElement | HTMLTextAreaElement | null)?.value ?? "";

    const name = get("name").trim();
    const email = get("email").trim();
    if (!name || !email) {
      toast.error("Please fill in your name and email");
      return;
    }

    setLoading(true);
    try {
      await submitLead({
        form: "contact",
        name,
        email,
        phone: get("phone").trim() || undefined,
        service,
        message: get("message").trim() || undefined,
        hp: get("website_url"),
        startedAt: startedAt.current,
        extra: { lp: slug },
      });
      setDone(true);
      toast.success("Request received — we'll reply within 24 hours.");
    } catch (err) {
      toast.error(err instanceof LeadError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl glass border border-primary/30 p-8 text-center">
        <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-4" />
        <h3 className="font-display font-bold text-xl text-foreground mb-2">Request received</h3>
        <p className="text-sm text-muted-foreground">
          Our team will review your details and reply within 24 hours. For anything urgent, WhatsApp us directly.
        </p>
      </div>
    );
  }

  const field =
    "w-full rounded-lg bg-secondary/50 border border-border/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl glass border border-border/25 p-6 md:p-8">
      <div className="grid sm:grid-cols-2 gap-4">
        <input name="name" required placeholder="Your name *" className={field} autoComplete="name" />
        <input name="email" type="email" required placeholder="Work email *" className={field} autoComplete="email" />
        <input name="phone" type="tel" placeholder="Phone / WhatsApp" className={field} autoComplete="tel" />
        <input name="message" placeholder="What do you want to achieve?" className={field} />
      </div>
      {/* Honeypot — hidden from humans, catches bots */}
      <input name="website_url" type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <Button
        type="submit"
        disabled={loading}
        size="lg"
        className="mt-5 w-full sm:w-auto rounded-full px-8 font-display font-semibold bg-gradient-to-r from-[hsl(20,90%,50%)] to-[hsl(30,100%,45%)] text-white shadow-lg"
      >
        {loading ? "Sending…" : "Get My Free Plan"} <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
      <p className="mt-3 text-xs text-muted-foreground">
        No spam, no lock-in. We reply within 24 hours with a specific plan for your business.
      </p>
    </form>
  );
}
