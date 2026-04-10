import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, MessageCircle, Calendar, Clock, CheckCircle2, Send } from "lucide-react";
import { useState } from "react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const offices = [
  { city: "New Delhi, India", phone: "+91 11 4567 8900", email: "india@digitalpenta.com", flag: "🇮🇳" },
  { city: "Dubai, UAE", phone: "+971 4 567 8901", email: "dubai@digitalpenta.com", flag: "🇦🇪" },
  { city: "Riyadh, KSA", phone: "+966 11 567 8902", email: "ksa@digitalpenta.com", flag: "🇸🇦" },
];

const services = [
  "Digital Marketing",
  "SEO & Content Marketing",
  "Social Media Marketing",
  "Performance Marketing (PPC)",
  "Public Relations",
  "Website & App Development",
  "AI Solutions",
  "Marketing Automation",
  "Brand Strategy & Identity",
  "Email & WhatsApp Marketing",
  "Multiple Services",
];

const budgets = [
  "₹50,000 — ₹1,00,000 / month",
  "₹1,00,000 — ₹3,00,000 / month",
  "₹3,00,000 — ₹5,00,000 / month",
  "₹5,00,000+ / month",
  "Project-based (one-time)",
  "Not sure yet",
];

const GOOGLE_CALENDAR_URL = "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const formInView = useInView(formRef, { once: true });

  return (
    <Layout>
      {/* ── Hero ── */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-primary/8 blur-[150px] animate-breathe" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Contact Us</span>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mt-4 mb-4">
              Contact Digital Penta — Book a <span className="text-gradient">Free Strategy Call</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Whether you have a project in mind or just want to explore possibilities — we're here to help you grow.
            </p>
            {/* Response time indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full glass border border-accent/20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Clock className="w-4 h-4 text-accent" />
              </motion.div>
              <span className="text-xs font-mono text-accent">We typically respond in 2 hours</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="pb-24" ref={formRef}>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">

            {/* ── Contact Form ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={formInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="lg:col-span-3 rounded-2xl glass border border-border/30 p-8"
            >
              {submitted ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <Send className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-foreground mb-3">Message Sent Successfully!</h3>
                  <p className="text-muted-foreground mb-6">
                    Our team will get back to you within 24 hours with a custom growth plan.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-accent" /> No spam, ever</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-accent" /> Response within 24hrs</span>
                  </div>
                </motion.div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    // Honeypot check
                    const hp = form.querySelector<HTMLInputElement>('[name="website_url"]');
                    if (hp && hp.value) return;
                    setSubmitted(true);
                  }}
                  className="space-y-5"
                >
                  {/* Honeypot field */}
                  <div className="absolute -left-[9999px]" aria-hidden="true">
                    <input type="text" name="website_url" tabIndex={-1} autoComplete="off" />
                  </div>
                  <h2 className="font-display font-bold text-xl text-foreground mb-1">Send Us a Message</h2>
                  <p className="text-sm text-muted-foreground mb-4">Fill out the form and we'll craft a custom strategy for your brand.</p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className={`absolute left-3 transition-all duration-300 pointer-events-none ${focusedField === 'name' ? 'top-1 text-[9px] text-primary' : 'top-2.5 text-xs text-muted-foreground'} font-display font-medium`}>Full Name *</label>
                      <Input
                        required
                        className="bg-secondary/50 border-border/50 pt-5 focus:border-primary/40"
                        onFocus={() => setFocusedField('name')}
                        onBlur={(e) => !e.target.value && setFocusedField(null)}
                      />
                    </div>
                    <div className="relative">
                      <label className={`absolute left-3 transition-all duration-300 pointer-events-none ${focusedField === 'email' ? 'top-1 text-[9px] text-primary' : 'top-2.5 text-xs text-muted-foreground'} font-display font-medium`}>Email *</label>
                      <Input
                        type="email"
                        required
                        className="bg-secondary/50 border-border/50 pt-5 focus:border-primary/40"
                        onFocus={() => setFocusedField('email')}
                        onBlur={(e) => !e.target.value && setFocusedField(null)}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-display font-medium text-foreground mb-1.5 block">Phone</label>
                      <Input placeholder="+91 98765 43210" className="bg-secondary/50 border-border/50" />
                    </div>
                    <div>
                      <label className="text-xs font-display font-medium text-foreground mb-1.5 block">Company</label>
                      <Input placeholder="Company Name" className="bg-secondary/50 border-border/50" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-display font-medium text-foreground mb-1.5 block">Service Interested In *</label>
                      <select required className="flex h-10 w-full rounded-md border border-border/50 bg-secondary/50 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <option value="">Select a service</option>
                        {services.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-display font-medium text-foreground mb-1.5 block">Monthly Budget</label>
                      <select className="flex h-10 w-full rounded-md border border-border/50 bg-secondary/50 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <option value="">Select budget range</option>
                        {budgets.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-display font-medium text-foreground mb-1.5 block">Message</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about your project, goals, and timeline..."
                      className="flex w-full rounded-md border border-border/50 bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full rounded-full font-display font-bold text-base bg-gradient-to-r from-[hsl(20,90%,50%)] to-[hsl(30,100%,45%)] hover:opacity-90 text-white shadow-lg shadow-orange-500/20">
                    Send Message →
                  </Button>

                  <div className="flex flex-wrap justify-center gap-4 text-[10px] text-muted-foreground pt-2">
                    <span>✓ No spam, ever</span>
                    <span>✓ Response within 24hrs</span>
                    <span>✓ 100% confidential</span>
                  </div>
                </form>
              )}
            </motion.div>

            {/* ── Sidebar ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={formInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:col-span-2 space-y-4"
            >
              {/* Google Calendar booking */}
              <div className="rounded-2xl glass border border-primary/20 p-6 hover-glow transition-all duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">Book a Strategy Call</h3>
                    <p className="text-xs text-muted-foreground">30 min · Free · No commitment</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Pick a time that works for you. Our growth strategist will prepare a custom audit before the call.
                </p>
                <a href={GOOGLE_CALENDAR_URL} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full rounded-full font-display font-semibold gap-2">
                    <Calendar className="w-4 h-4" />
                    Book via Google Calendar
                  </Button>
                </a>
              </div>

              {/* Office cards */}
              {offices.map((o) => (
                <div key={o.city} className="rounded-2xl glass border border-border/30 p-5 hover:border-primary/15 transition-all duration-500 group">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{o.flag}</span>
                    <h3 className="font-display font-semibold text-sm text-foreground">{o.city}</h3>
                  </div>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <a href={`tel:${o.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-foreground transition-colors">
                      <Phone className="w-3 h-3" /> {o.phone}
                    </a>
                    <a href={`mailto:${o.email}`} className="flex items-center gap-2 hover:text-foreground transition-colors">
                      <Mail className="w-3 h-3" /> {o.email}
                    </a>
                  </div>
                </div>
              ))}

              {/* WhatsApp */}
              <a
                href="https://wa.me/919876543210?text=Hi%20Digital%20Penta!%20I%27d%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl glass border border-emerald-500/20 p-5 hover:bg-card/60 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-display font-semibold text-sm text-foreground">WhatsApp Us</p>
                  <p className="text-xs text-muted-foreground">Quick response · Available 9am–9pm IST</p>
                </div>
              </a>
            </motion.div>
          </div>

          {/* ── Google Maps Embed ── */}
          <div className="max-w-6xl mx-auto mt-12">
            <div className="rounded-2xl overflow-hidden border border-border/30">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83923421084!2d77.06889754725782!3d28.52758200617607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1703000000000!5m2!1sen!2sin"
                width="100%"
                height="300"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Digital Penta Office Location - New Delhi, India"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
