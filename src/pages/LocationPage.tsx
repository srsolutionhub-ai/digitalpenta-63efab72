import Layout from "@/components/layout/Layout";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, MapPin, Phone, Mail, Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLocationData } from "@/data/locationData";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import MagneticCard from "@/components/ui/magnetic-card";

const ease = [0.16, 1, 0.3, 1] as const;

export default function LocationPage() {
  const { location } = useParams<{ location: string }>();
  const data = getLocationData(location || "");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

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

      <section className="pt-8 pb-20 relative" ref={ref}>
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease }}
            className="max-w-3xl"
          >
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent rounded-full mb-6" />
            <div className="flex items-center gap-2 mb-4">
              <div className="relative">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary/40 animate-ping" />
              </div>
              <span className="text-xs font-mono text-primary uppercase tracking-widest">{data.city}, {data.country}</span>
            </div>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl text-foreground mb-6 leading-tight">{data.tagline}</h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">{data.description}</p>
            <div className="mt-8 flex gap-3">
              <Link to="/get-proposal"><Button className="rounded-full px-8 font-display font-semibold">Get A Proposal</Button></Link>
              <Link to="/contact"><Button variant="outline" className="rounded-full px-8 font-display font-semibold border-border/40">Contact {data.city} Office</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 border-t border-border/30">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="font-display font-bold text-2xl md:text-3xl text-foreground mb-10"
          >
            Services Available in <span className="text-gradient">{data.city}</span>
          </motion.h2>
          <div className="flex flex-wrap gap-3">
            {data.services.map((s, i) => (
              <motion.span
                key={s}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05, ease }}
                className="px-5 py-2.5 rounded-full glass border border-border/30 text-sm font-display font-medium text-muted-foreground hover:border-primary/20 hover:text-foreground transition-all duration-400"
              >
                {s}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <MagneticCard className="h-full">
              <div className="rounded-2xl glass border border-border/30 p-8 h-full">
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
            </MagneticCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
          >
            <MagneticCard className="h-full">
              <div className="rounded-2xl glass border border-primary/15 p-8 h-full relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                <Star className="w-6 h-6 fill-amber-400 text-amber-400 mb-4" />
                <p className="text-foreground/90 leading-relaxed mb-6 text-lg font-display">"{data.testimonial.quote}"</p>
                <p className="font-display font-bold text-foreground">{data.testimonial.name}</p>
                <p className="text-xs text-muted-foreground">{data.testimonial.role}</p>
              </div>
            </MagneticCard>
          </motion.div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
              Ready to Grow in <span className="text-gradient">{data.city}</span>?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">Let our local team craft a strategy tailored to your market.</p>
            <Link to="/get-proposal"><Button size="lg" className="rounded-full px-10 font-display font-semibold">Get Your Free Proposal →</Button></Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
