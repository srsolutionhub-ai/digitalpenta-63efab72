import { Link } from "react-router-dom";
import { ArrowRight, Linkedin, Twitter, Instagram, Youtube, Facebook, MapPin, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "motion/react";
import { supabase } from "@/integrations/supabase/client";

const footerSections = [
  {
    title: "Services",
    links: [
      { label: "SEO & Content Marketing", href: "/services/digital-marketing/seo" },
      { label: "Social Media Marketing", href: "/services/digital-marketing/social-media" },
      { label: "Performance Marketing", href: "/services/digital-marketing/performance" },
      { label: "Web Design & Development", href: "/services/development/website" },
      { label: "Email & WhatsApp Marketing", href: "/services/digital-marketing/email" },
      { label: "Brand Strategy", href: "/services/public-relations/brand-reputation" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Case Studies", href: "/portfolio" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "Real Estate", href: "/industries/real-estate" },
      { label: "Healthcare", href: "/industries/healthcare" },
      { label: "E-commerce", href: "/industries/ecommerce" },
      { label: "Finance", href: "/industries/finance" },
      { label: "SaaS", href: "/industries/saas" },
    ],
  },
];

const socials = [
  { icon: Instagram, href: "https://www.instagram.com/digitalpenta", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com/digitalpenta", label: "Facebook" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/digitalpenta", label: "LinkedIn" },
  { icon: Youtube, href: "https://www.youtube.com/@digitalpenta", label: "YouTube" },
  { icon: Twitter, href: "https://twitter.com/digitalpenta", label: "Twitter/X" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("@")) {
      await supabase.from("newsletter_subscribers").insert({ email, source: "Footer" });
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="relative border-t border-border/30 pb-16 lg:pb-0">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* CTA Banner */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl overflow-hidden relative p-10 md:p-16 text-center"
          style={{
            background:
              "linear-gradient(135deg, hsl(256 90% 22%) 0%, hsl(322 90% 22%) 50%, hsl(192 95% 22%) 100%)",
            boxShadow: "0 40px 100px -20px hsl(256 90% 30% / 0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Animated conic glow */}
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-30 pointer-events-none"
            style={{
              background: "conic-gradient(from 0deg, transparent 0deg, hsl(256 100% 70% / 0.6) 60deg, transparent 120deg, hsl(192 100% 65% / 0.5) 200deg, transparent 260deg)",
              animation: "conic-spin 20s linear infinite",
            }}
          />
          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }} />
          <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full blur-[120px] pointer-events-none"
            style={{ background: "hsl(322 100% 70% / 0.3)" }} />
          <div className="absolute bottom-0 right-1/4 w-56 h-56 rounded-full blur-[100px] pointer-events-none"
            style={{ background: "hsl(192 100% 65% / 0.3)" }} />

          <div className="relative z-10">
            <span className="neon-chip mb-6" style={{ background: "rgba(255,255,255,0.10)", borderColor: "rgba(255,255,255,0.25)", color: "white" }}>
              Free Strategy Call
            </span>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl text-white mt-5 mb-4 leading-[1.1]"
              style={{ filter: "drop-shadow(0 4px 24px hsl(256 100% 50% / 0.5))" }}
            >
              Ready to 5X Your Business? Let's Talk.
            </h2>
            <p className="text-white/85 max-w-lg mx-auto mb-8 text-base">
              Book a FREE 30-minute strategy call with our growth experts. No commitment. No fluff. Just a plan.
            </p>
            <Link to="/contact">
              <Button size="lg" className="rounded-full px-10 py-6 font-display font-bold text-base gap-2 bg-white text-background hover:bg-white/95 shadow-2xl transition-all hover:scale-[1.03]"
                style={{ boxShadow: "0 20px 60px -10px rgba(0,0,0,0.5), 0 0 40px -8px hsl(256 100% 70% / 0.7)" }}
              >
                📅 Book Free Strategy Call <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center justify-center gap-6 mt-6 text-white/70 text-xs font-mono">
              <span>✓ No credit card</span>
              <span>✓ Cancel anytime</span>
              <span>✓ Response within 24 hours</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Newsletter + Links */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <svg viewBox="0 0 40 40" className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none">
                <defs>
                  <linearGradient id="pentaGradFoot" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(256, 90%, 60%)" />
                    <stop offset="100%" stopColor="hsl(162, 100%, 42%)" />
                  </linearGradient>
                </defs>
                <polygon points="20,2 38,14 32,34 8,34 2,14" stroke="url(#pentaGradFoot)" strokeWidth="1.5" fill="hsl(256, 90%, 60%)" fillOpacity="0.1" />
                <text x="20" y="24" textAnchor="middle" fill="url(#pentaGradFoot)" fontSize="12" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif">DP</text>
              </svg>
              <span className="font-display font-bold text-foreground">
                Digital<span className="text-gradient">Penta</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed mb-5 max-w-xs">
              5X Your Digital Presence. India's results-driven digital marketing agency helping brands dominate online with SEO, Ads, Social Media, Development & AI.
            </p>

            {/* Contact info */}
            <div className="space-y-2 mb-5">
              <a href="mailto:support@digitalpenta.com" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group">
                <Mail className="w-3.5 h-3.5 group-hover:text-primary transition-colors" /> support@digitalpenta.com
              </a>
              <a href="tel:+918860100039" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group">
                <Phone className="w-3.5 h-3.5 group-hover:text-primary transition-colors" /> +91-88601-00039
              </a>
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" /> Corporate Office - Delhi, India
              </span>
            </div>

            {/* Newsletter */}
            <p className="text-xs font-display font-semibold text-foreground mb-2">Subscribe to our newsletter</p>
            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-xs text-primary font-display"
              >
                <span className="text-lg">🎉</span> You're subscribed! Check your inbox.
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-xs">
                <Input
                  placeholder="Your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-secondary/40 border-border/30 text-xs h-9 focus:border-primary/40"
                  required
                />
                <Button type="submit" size="sm" className="rounded-lg px-3 h-9 text-xs font-display font-semibold">
                  Subscribe
                </Button>
              </form>
            )}
            <div className="flex items-center gap-2 mt-5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-secondary/40 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/20 hover:bg-primary/5 transition-all duration-300"
                >
                  <s.icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-display font-semibold text-sm text-foreground mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-xs text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border/20">
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Digital Penta. All rights reserved. | Corporate Office - Delhi, India | support@digitalpenta.com
          </span>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
