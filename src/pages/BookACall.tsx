import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Clock, Shield, Sparkles, MessageCircle, Phone } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEOHead, { breadcrumbSchema, organizationSchema } from "@/components/seo/SEOHead";
import BookingCalendar from "@/components/booking/BookingCalendar";
import { Button } from "@/components/ui/button";

/**
 * Dedicated /book-a-call route — primary conversion destination
 * promoted from the navbar, hero CTAs and the ⌘K palette.
 *
 * Uses the existing BookingCalendar component (already integrated with
 * Cal.com / internal calendar). Calendar iframe is deferred until the
 * embed section enters the viewport to protect LCP on slower devices.
 */
export default function BookACall() {
  const embedRef = useRef<HTMLDivElement>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (!embedRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowCalendar(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(embedRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Layout>
      <SEOHead
        title="Book a Free Strategy Call | Digital Penta"
        description="Lock in a 30-minute call with a senior strategist. No sales pitch — we audit your funnel, surface 3 fast wins, and tell you whether we're a fit. 100% free."
        canonical="https://digitalpenta.com/book-a-call"
        schemas={[
          breadcrumbSchema([
            { name: "Home", url: "https://digitalpenta.com/" },
            { name: "Book a Call", url: "https://digitalpenta.com/book-a-call" },
          ]),
          organizationSchema(),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Free Digital Marketing Strategy Call",
            provider: { "@type": "Organization", name: "Digital Penta" },
            areaServed: ["IN", "AE", "SA", "QA"],
            description:
              "Complimentary 30-minute strategy session with a senior digital marketing strategist.",
            offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
          },
        ]}
      />

      <section className="relative pt-24 pb-16 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, hsl(256 90% 62% / 0.18), transparent 65%), radial-gradient(40% 40% at 90% 50%, hsl(192 95% 56% / 0.12), transparent 65%)",
          }}
        />
        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          <div className="text-center mb-12">
            <span className="neon-chip mb-5">100% Free · No Sales Pitch</span>
            <h1 className="font-display font-extrabold tracking-tight text-foreground"
              style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
            >
              Book a 30-minute <span className="text-gradient">strategy call</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
              A senior strategist will audit your funnel live, surface 3 fast wins
              you can ship this month, and tell you honestly whether we're the right fit.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Value column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card p-6">
                <h2 className="font-display font-bold text-lg text-foreground mb-4">
                  What you'll walk away with
                </h2>
                <ul className="space-y-3">
                  {[
                    "A 5-axis Growth Score for your current marketing setup",
                    "3 specific quick wins prioritised by ROI vs. effort",
                    "Benchmark numbers from 2–3 brands in your category",
                    "An honest call on whether DIY, freelancer, or agency is right for you",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-sm text-foreground mb-3">Trusted by</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-accent" /> Google Partner</div>
                  <div className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-accent" /> Meta Business</div>
                  <div className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-primary" /> 500+ Clients</div>
                  <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-primary" /> 4.9★ · 87 reviews</div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Prefer a different channel?</p>
                <a
                  href="https://wa.me/918860100039?text=Hi%20Digital%20Penta%2C%20I%27d%20like%20to%20book%20a%20strategy%20call"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-foreground font-display font-semibold text-sm transition"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" /> Chat on WhatsApp
                </a>
                <a
                  href="tel:+918860100039"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/[0.08] bg-card/50 hover:bg-card text-foreground font-display font-semibold text-sm transition"
                >
                  <Phone className="w-4 h-4 text-primary" /> Call +91-88601-00039
                </a>
              </div>
            </div>

            {/* Calendar column */}
            <div className="lg:col-span-3">
              <div className="glass-card p-6 md:p-8 min-h-[520px]" ref={embedRef}>
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Pick a slot · IST</span>
                </div>

                {showCalendar ? (
                  <BookingCalendar
                    source="book-a-call"
                    trigger={
                      <Button size="lg" className="w-full rounded-xl font-display font-bold text-base h-14">
                        Open Calendar · Pick a Time →
                      </Button>
                    }
                  />
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <div className="h-2 w-32 rounded-full bg-white/[0.06] animate-pulse" />
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-6 font-mono text-center">
                  Slots fill up fast · usual reply within 2 hours during business hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
