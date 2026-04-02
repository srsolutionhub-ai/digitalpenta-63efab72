import Layout from "@/components/layout/Layout";
import { Shield, Target, Eye, MapPin } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const team = [
  { name: "Founder & CEO", role: "Strategy & Vision", initials: "DP" },
  { name: "Head of Marketing", role: "Digital Marketing & PR", initials: "HM" },
  { name: "CTO", role: "Development & AI", initials: "CT" },
  { name: "Creative Director", role: "Design & Branding", initials: "CD" },
  { name: "VP Operations", role: "Automation & Delivery", initials: "VP" },
  { name: "Head of Growth", role: "Performance & Analytics", initials: "HG" },
];

const timeline = [
  { year: "2020", event: "Founded in Delhi with a vision to unify digital services" },
  { year: "2021", event: "Expanded to Dubai, serving first Middle East clients" },
  { year: "2022", event: "Launched AI Solutions & Automation division" },
  { year: "2023", event: "100+ active clients across 8 countries" },
  { year: "2024", event: "Opened offices in Riyadh and Abu Dhabi" },
  { year: "2025", event: "500+ projects delivered, ₹100Cr+ revenue generated for clients" },
];

const offices = [
  { city: "New Delhi", country: "India", type: "HQ" },
  { city: "Dubai", country: "UAE", type: "Regional" },
  { city: "Abu Dhabi", country: "UAE", type: "Regional" },
  { city: "Riyadh", country: "KSA", type: "Regional" },
  { city: "Doha", country: "Qatar", type: "Regional" },
];

export default function About() {
  const heroRef = useScrollReveal<HTMLDivElement>();
  const missionRef = useScrollReveal<HTMLDivElement>();
  const teamRef = useScrollReveal<HTMLDivElement>();
  const timelineRef = useScrollReveal<HTMLDivElement>();
  const officesRef = useScrollReveal<HTMLDivElement>();

  return (
    <Layout>
      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="container mx-auto px-4 relative z-10" ref={heroRef}>
          <div className="max-w-3xl" data-reveal>
            <span className="text-xs font-mono text-primary uppercase tracking-widest">About Us</span>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 mb-6">
              We Build <span className="text-gradient">Growth Systems</span>, Not Just Campaigns.
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
              Digital Penta was born from a simple insight: brands don't need five agencies — they need one that thinks across all five dimensions.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 border-y border-border/30" ref={missionRef}>
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl glass border border-border/30 p-8" data-reveal>
            <Target className="w-6 h-6 text-primary mb-4" />
            <h2 className="font-display font-bold text-2xl text-foreground mb-3">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              To empower businesses across India and the Middle East with integrated digital solutions that drive measurable, sustainable growth — eliminating the chaos of fragmented agencies.
            </p>
          </div>
          <div className="rounded-2xl glass border border-border/30 p-8" data-reveal>
            <Eye className="w-6 h-6 text-accent mb-4" />
            <h2 className="font-display font-bold text-2xl text-foreground mb-3">Our Vision</h2>
            <p className="text-muted-foreground leading-relaxed">
              To become the most trusted full-stack digital partner for enterprises and ambitious brands in the India-MENA corridor by 2028.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20" ref={teamRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-14" data-reveal>
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Leadership</span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-foreground mt-3">
              The Minds Behind <span className="text-gradient">The Machine</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {team.map((t) => (
              <div key={t.initials} data-reveal className="rounded-2xl glass border border-border/30 p-6 text-center group hover:bg-card/60 hover:border-primary/15 transition-all duration-500">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="font-display font-bold text-primary text-lg">{t.initials}</span>
                </div>
                <h3 className="font-display font-semibold text-foreground">{t.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-card/20" ref={timelineRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-14" data-reveal>
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Our Journey</span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-foreground mt-3">
              From Startup to <span className="text-gradient">Scale-up</span>
            </h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-0" data-reveal>
            {timeline.map((t, i) => (
              <div key={t.year} className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-primary border-2 border-background" />
                  {i < timeline.length - 1 && <div className="w-px h-full bg-border/50" />}
                </div>
                <div className="pb-8">
                  <span className="font-mono text-xs text-primary">{t.year}</span>
                  <p className="text-foreground mt-1">{t.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" ref={officesRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-14" data-reveal>
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Locations</span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-foreground mt-3">
              Global Reach, <span className="text-gradient">Local Expertise</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {offices.map((o) => (
              <div key={o.city} data-reveal className="rounded-2xl glass border border-border/30 p-5 text-center hover:border-primary/15 transition-all duration-500">
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
    </Layout>
  );
}
