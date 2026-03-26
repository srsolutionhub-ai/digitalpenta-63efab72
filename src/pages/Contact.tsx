import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { useState } from "react";

const offices = [
  { city: "New Delhi, India", phone: "+91 11 XXXX XXXX", email: "india@digitalpenta.com" },
  { city: "Dubai, UAE", phone: "+971 4 XXX XXXX", email: "dubai@digitalpenta.com" },
  { city: "Riyadh, KSA", phone: "+966 11 XXX XXXX", email: "ksa@digitalpenta.com" },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Layout>
      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Contact Us</span>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-foreground mt-4 mb-4">
              Let's Start a <span className="text-gradient">Conversation</span>
            </h1>
            <p className="text-muted-foreground">
              Whether you have a project in mind or just want to explore possibilities — we're here.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
            {/* Form */}
            <div className="lg:col-span-3 rounded-xl glass p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-foreground mb-2">Message Sent!</h3>
                  <p className="text-sm text-muted-foreground">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                  className="space-y-4"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-display font-medium text-foreground mb-1.5 block">Full Name</label>
                      <Input placeholder="John Doe" required className="bg-secondary/50 border-border/50" />
                    </div>
                    <div>
                      <label className="text-xs font-display font-medium text-foreground mb-1.5 block">Email</label>
                      <Input type="email" placeholder="john@company.com" required className="bg-secondary/50 border-border/50" />
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
                  <div>
                    <label className="text-xs font-display font-medium text-foreground mb-1.5 block">Service Interested In</label>
                    <select className="flex h-10 w-full rounded-md border border-border/50 bg-secondary/50 px-3 py-2 text-sm text-foreground">
                      <option value="">Select a service</option>
                      <option>Digital Marketing</option>
                      <option>Public Relations</option>
                      <option>Development</option>
                      <option>AI Solutions</option>
                      <option>Automation</option>
                      <option>Multiple Services</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-display font-medium text-foreground mb-1.5 block">Message</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about your project..."
                      className="flex w-full rounded-md border border-border/50 bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <Button type="submit" className="w-full rounded-full font-display font-semibold">
                    Send Message
                  </Button>
                </form>
              )}
            </div>

            {/* Info */}
            <div className="lg:col-span-2 space-y-4">
              {offices.map((o) => (
                <div key={o.city} className="rounded-xl glass p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-primary" />
                    <h3 className="font-display font-semibold text-sm text-foreground">{o.city}</h3>
                  </div>
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> {o.phone}</div>
                    <div className="flex items-center gap-2"><Mail className="w-3 h-3" /> {o.email}</div>
                  </div>
                </div>
              ))}
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl glass p-5 hover:bg-card/60 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-display font-semibold text-sm text-foreground">WhatsApp Us</p>
                  <p className="text-xs text-muted-foreground">Quick response for Middle East</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
