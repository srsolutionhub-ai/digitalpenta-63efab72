import Layout from "@/components/layout/Layout";
import { Shield, Target, Eye, MapPin, Award, Users, Globe, Zap, Heart, TrendingUp, CheckCircle2, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";
import aboutBanner from "@/assets/about-banner-graphic.jpg";
import SEOHead, { breadcrumbSchema, organizationSchema } from "@/components/seo/SEOHead";

/* ── Animated counter ── */
function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

/* ── Data ── */
const stats = [
  { value: 500, suffix: "+", label: "Clients Served" },
  { value: 3, suffix: "X", label: "Average ROI" },
  { value: 50, suffix: "+", label: "Team Members" },
  { value: 8, suffix: "+", label: "Countries" },
];

const values = [
  { icon: TrendingUp, title: "Results First", desc: "Every decision we make is measured against growth. No vanity metrics — only numbers that matter to your bottom line.", featured: true, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { icon: Shield, title: "Radical Transparency", desc: "Real-time dashboards, weekly reports, and honest conversations. You always know where your money is going.", color: "text-violet-400", bg: "bg-violet-500/10" },
  { icon: Zap, title: "Speed to Market", desc: "We launch campaigns in 7 days, not 7 weeks. Agile sprints and rapid iteration keep you ahead of competitors.", color: "text-orange-400", bg: "bg-orange-500/10" },
  { icon: Heart, title: "Client Obsession", desc: "98% retention rate because we treat your business like our own. Dedicated teams, not revolving account managers.", color: "text-pink-400", bg: "bg-pink-500/10" },
  { icon: Globe, title: "India-MENA Expertise", desc: "Deep cultural fluency across Indian and Middle Eastern markets. We don't just translate — we localize.", color: "text-cyan-400", bg: "bg-cyan-500/10" },
];

const team = [
  { name: "Arjun Mehta", role: "Founder & CEO", focus: "Strategy & Vision", initials: "AM", gradient: "from-violet-500 to-purple-600", linkedin: "#" },
  { name: "Sneha Kapoor", role: "Head of Marketing", focus: "Digital Marketing & PR", initials: "SK", gradient: "from-cyan-500 to-blue-600", linkedin: "#" },
  { name: "Vikram Reddy", role: "CTO", focus: "Development & AI", initials: "VR", gradient: "from-emerald-500 to-green-600", linkedin: "#" },
  { name: "Priya Sharma", role: "Creative Director", focus: "Design & Branding", initials: "PS", gradient: "from-pink-500 to-rose-600", linkedin: "#" },
  { name: "Rohan Patel", role: "VP Operations", focus: "Automation & Delivery", initials: "RP", gradient: "from-amber-500 to-orange-600", linkedin: "#" },
  { name: "Aisha Khan", role: "Head of Growth", focus: "Performance & Analytics", initials: "AK", gradient: "from-indigo-500 to-violet-600", linkedin: "#" },
];

const timeline = [
  { year: "2020", event: "Founded in Delhi with a vision to unify digital services under one roof" },
  { year: "2021", event: "Expanded to Dubai, serving first Middle East enterprise clients" },
  { year: "2022", event: "Launched AI Solutions & Automation division — 100+ clients milestone" },
  { year: "2023", event: "Opened Riyadh office, ₹50Cr+ client revenue generated" },
  { year: "2024", event: "Google Premier Partner & Meta Business Partner certifications" },
  { year: "2025", event: "500+ projects delivered, ₹100Cr+ total revenue generated for clients" },
];

const awards = [
  "Google Premier Partner",
  "Meta Business Partner",
  "HubSpot Solutions Partner",
  "Clutch Top Agency 2024",
  "Deloitte Fast 50",
  "ISO 27001 Certified",
];

const offices = [
  { city: "New Delhi", country: "India", type: "HQ" },
  { city: "Dubai", country: "UAE", type: "Regional" },
  { city: "Abu Dhabi", country: "UAE", type: "Regional" },
  { city: "Riyadh", country: "KSA", type: "Regional" },
  { city: "Doha", country: "Qatar", type: "Regional" },
];

export default function About() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });
  const storyRef = useRef<HTMLDivElement>(null);
  const storyInView = useInView(storyRef, { once: true });
  const valuesRef = useRef<HTMLDivElement>(null);
  const valuesInView = useInView(valuesRef, { once: true });
  const teamRef = useRef<HTMLDivElement>(null);
  const teamInView = useInView(teamRef, { once: true });
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineInView = useInView(timelineRef, { once: true });

  return (
    <Layout>
      <SEOHead
        title="About Digital Penta | Award-Winning Marketing Agency in Delhi"
        description="Meet Digital Penta — Delhi-based digital marketing agency serving 500+ brands across India, UAE, KSA. Five disciplines, one ROI-obsessed team."
        canonical="https://digitalpenta.com/about"
        hreflangs={[
          { hreflang: "en", href: "https://digitalpenta.com/about" },
          { hreflang: "en-IN", href: "https://digitalpenta.com/about" },
          { hreflang: "x-default", href: "https://digitalpenta.com/about" },
        ]}
        schemas={[
          organizationSchema(),
          breadcrumbSchema([
            { name: "Home", url: "https://digitalpenta.com/" },
            { name: "About", url: "https://digitalpenta.com/about" },
          ]),
        ]}
      />
      {/* ── Hero ── */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={aboutBanner} alt="" className="w-full h-full object-cover" loading="eager" width={1920} height={1080} style={{ opacity: 0.55 }} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/30" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 0%, transparent 30%, hsl(var(--background) / 0.65) 75%, hsl(var(--background)) 100%)" }} />
        </div>
        <div className="absolute inset-0 mesh-gradient opacity-40" />
        <div className="absolute top-[20%] right-[5%] w-[400px] h-[400px] rounded-full bg-primary/8 blur-[150px] animate-breathe" />
        <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] rounded-full bg-accent/6 blur-[120px] animate-breathe-slow" />

        <div className="container mx-auto px-4 relative z-10" ref={heroRef}>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <span className="text-xs font-mono text-primary uppercase tracking-widest">About Digital Penta</span>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 mb-6">
              About Digital Penta — India's Leading{" "}
              <span className="text-gradient">Digital Marketing Agency</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
              We don't just run campaigns — we build growth systems. Born in India, scaling across the Middle East,
              Digital Penta is the full-stack digital partner for brands that refuse to settle.
            </p>
          </motion.div>

          {/* Stats counter row */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14"
          >
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl glass border border-border/30 p-6 text-center hover-glow transition-all duration-500">
                <span className="font-mono font-bold text-3xl md:text-4xl text-gradient">
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </span>
                <p className="text-xs text-muted-foreground mt-2 font-display">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="py-24 border-y border-border/30 relative overflow-hidden" ref={storyRef}>
        <div className="absolute top-8 left-8 font-display font-extrabold text-[120px] leading-none text-foreground/[0.03] select-none pointer-events-none">
          2020
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={storyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <span className="text-xs font-mono text-primary uppercase tracking-widest">Our Story</span>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl text-foreground mt-3 mb-6">
                From a Delhi Startup to a <span className="text-gradient">Global Force</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Digital Penta was born in 2020 from a simple frustration: brands were juggling five different agencies
                  for marketing, PR, development, AI, and automation — with none of them talking to each other.
                </p>
                <p>
                  We asked: what if one team could think across all five dimensions? The name "Penta" — meaning five —
                  became our philosophy. Five integrated pillars. One unified growth engine.
                </p>
                <p>
                  Today, we're 50+ specialists strong, operating across India and the Middle East, helping
                  500+ brands achieve measurable, compounding growth.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl glass border border-border/30 p-6 hover-glow transition-all duration-500">
                <Target className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-display font-bold text-foreground mb-2">Our Mission</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To empower businesses across India and the Middle East with integrated digital solutions
                  that drive measurable, sustainable growth.
                </p>
              </div>
              <div className="rounded-2xl glass border border-border/30 p-6 hover-glow transition-all duration-500">
                <Eye className="w-6 h-6 text-accent mb-3" />
                <h3 className="font-display font-bold text-foreground mb-2">Our Vision</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To become the most trusted full-stack digital partner for enterprises in the India-MENA corridor by 2028.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Core Values (Bento) ── */}
      <section className="py-24" ref={valuesRef}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Core Values</span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-foreground mt-3">
              The Five Pillars of <span className="text-gradient">Penta</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 32 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`rounded-2xl glass border p-8 transition-all duration-500 hover:border-primary/20 group ${
                  v.featured
                    ? "md:row-span-2 border-primary/20 bg-primary/[0.03]"
                    : "border-border/30"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${v.bg} group-hover:scale-110 transition-transform duration-500`}>
                  <v.icon className={`w-5 h-5 ${v.color}`} />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-3">{v.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-24 bg-card/20" ref={teamRef}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Leadership</span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-foreground mt-3">
              The Minds Behind <span className="text-gradient">The Machine</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              50+ specialists across marketing, tech, design, and strategy — led by a team obsessed with your growth.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {team.map((t, i) => (
              <motion.div
                key={t.initials}
                initial={{ opacity: 0, y: 32 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group rounded-2xl glass border border-border/30 p-6 text-center hover:border-primary/20 transition-all duration-500 relative overflow-hidden"
              >
                {/* Gradient avatar ring */}
                <div className="relative mx-auto mb-4 w-20 h-20">
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${t.gradient} opacity-20 group-hover:opacity-40 transition-opacity`} />
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${t.gradient} p-[2px]`}>
                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                      <span className="font-display font-bold text-primary text-xl">{t.initials}</span>
                    </div>
                  </div>
                </div>
                <h3 className="font-display font-bold text-foreground">{t.name}</h3>
                <p className="text-sm text-primary font-display font-medium mt-1">{t.role}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.focus}</p>
                {/* Hover LinkedIn reveal */}
                <a href={t.linkedin} className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 hover:text-primary">
                  <Linkedin className="w-3 h-3" /> Connect
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-24 relative overflow-hidden" ref={timelineRef}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={timelineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Our Journey</span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-foreground mt-3">
              From Startup to <span className="text-gradient">Scale-up</span>
            </h2>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            {timeline.map((t, i) => (
              <motion.div
                key={t.year}
                initial={{ opacity: 0, x: -24 }}
                animate={timelineInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-6 group relative"
              >
                <div className="absolute -left-16 md:-left-24 top-0 font-display font-extrabold text-[48px] md:text-[64px] text-foreground/[0.03] select-none pointer-events-none leading-none">
                  {t.year}
                </div>
                <div className="flex flex-col items-center">
                  <motion.div
                    className="w-3 h-3 rounded-full bg-primary border-2 border-background z-10"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {i < timeline.length - 1 && <div className="w-px h-full bg-border/50" />}
                </div>
                <div className="pb-8">
                  <span className="font-mono text-xs text-primary font-bold">{t.year}</span>
                  <p className="text-foreground mt-1 leading-relaxed">{t.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Awards & Certifications – Interactive Marquee ── */}
      <section className="py-16 border-y border-border/30 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Recognition</span>
            <h2 className="font-display font-bold text-2xl text-foreground mt-3">Awards & Certifications</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {awards.map((a) => (
              <motion.div
                key={a}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 px-5 py-3 rounded-full glass border border-border/30 hover:border-primary/20 transition-colors cursor-default"
              >
                <Award className="w-4 h-4 text-primary" />
                <span className="text-sm font-display font-medium text-foreground">{a}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Offices ── */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Locations</span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-foreground mt-3">
              Global Reach, <span className="text-gradient">Local Expertise</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {offices.map((o) => (
              <div key={o.city} className="rounded-2xl glass border border-border/30 p-5 text-center hover:border-primary/15 transition-all duration-500 hover-glow">
                <MapPin className="w-4 h-4 text-primary mx-auto mb-2" />
                <h3 className="font-display font-semibold text-sm text-foreground">{o.city}</h3>
                <p className="text-xs text-muted-foreground">{o.country}</p>
                {o.type === "HQ" && (
                  <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">HQ</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20" />
        <div className="absolute inset-0 mesh-gradient" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-foreground mb-4">
            Ready to 5X Your Business? <span className="text-gradient">Let's Talk.</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Book a FREE 30-minute strategy call with our growth experts. No commitment. No fluff. Just a plan.
          </p>
          <Link to="/contact">
            <Button size="lg" className="rounded-full px-10 py-6 font-display font-bold text-base bg-gradient-to-r from-[hsl(20,90%,50%)] to-[hsl(30,100%,45%)] hover:opacity-90 text-white shadow-lg shadow-orange-500/20">
              📅 Book Free Strategy Call
            </Button>
          </Link>
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-accent" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-accent" /> Cancel anytime</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-accent" /> Response within 24hrs</span>
          </div>
        </div>
      </section>
    </Layout>
  );
}
