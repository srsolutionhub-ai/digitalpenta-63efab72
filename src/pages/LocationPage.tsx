import Layout from "@/components/layout/Layout";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, MapPin, Phone, Mail, Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLocationData } from "@/data/locationData";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function LocationPage() {
  const { location } = useParams<{ location: string }>();
  const data = getLocationData(location || "");
  const sectionRef = useScrollReveal<HTMLDivElement>();

  if (!data) {
    return (
      <Layout>
        <section className="pt-32 pb-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="font-display font-bold text-3xl text-foreground">Location not found</h1>
            <Link to="/" className="text-primary text-sm mt-4 inline-block">← Back to Home</Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-24 pb-0">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{data.city}</span>
          </nav>
        </div>
      </div>

      <section className="pt-8 pb-20 relative" ref={sectionRef}>
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl" data-reveal>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-xs font-mono text-primary uppercase tracking-widest">{data.city}, {data.country}</span>
            </div>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl text-foreground mb-6 leading-tight">{data.tagline}</h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">{data.description}</p>
            <div className="mt-8 flex gap-3">
              <Link to="/get-proposal"><Button className="rounded-full px-8 font-display font-semibold">Get A Proposal</Button></Link>
              <Link to="/contact"><Button variant="outline" className="rounded-full px-8 font-display font-semibold border-border/40">Contact {data.city} Office</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-border/30">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-10">
            Services Available in <span className="text-gradient">{data.city}</span>
          </h2>
          <div className="flex flex-wrap gap-3">
            {data.services.map(s => (
              <span key={s} className="px-5 py-2.5 rounded-full glass border border-border/30 text-sm font-display font-medium text-muted-foreground">{s}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl glass border border-border/30 p-8">
            <h2 className="font-display font-bold text-xl text-foreground mb-6">{data.city} Office</h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3"><MapPin className="w-4 h-4 text-primary mt-0.5" /><span className="text-muted-foreground">{data.address}</span></div>
              <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-primary" /><span className="text-muted-foreground">{data.phone}</span></div>
              <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-primary" /><span className="text-muted-foreground">{data.email}</span></div>
            </div>
            {data.country !== "India" && (
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center gap-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4">
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="font-display font-semibold text-sm text-foreground">WhatsApp Us</p>
                  <p className="text-xs text-muted-foreground">Quick response</p>
                </div>
              </a>
            )}
          </div>

          <div className="rounded-2xl glass border border-primary/15 p-8">
            <Star className="w-6 h-6 fill-amber-400 text-amber-400 mb-4" />
            <p className="text-foreground/90 leading-relaxed mb-6 text-lg font-display">"{data.testimonial.quote}"</p>
            <p className="font-display font-bold text-foreground">{data.testimonial.name}</p>
            <p className="text-xs text-muted-foreground">{data.testimonial.role}</p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
            Ready to Grow in <span className="text-gradient">{data.city}</span>?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">Let our local team craft a strategy tailored to your market.</p>
          <Link to="/get-proposal"><Button size="lg" className="rounded-full px-10 font-display font-semibold">Get Your Free Proposal →</Button></Link>
        </div>
      </section>
    </Layout>
  );
}
