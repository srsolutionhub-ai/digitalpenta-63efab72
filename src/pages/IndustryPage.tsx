import Layout from "@/components/layout/Layout";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, ArrowUpRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getIndustryData } from "@/data/industryData";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function IndustryPage() {
  const { industry } = useParams<{ industry: string }>();
  const data = getIndustryData(industry || "");
  const sectionRef = useScrollReveal<HTMLDivElement>();

  if (!data) {
    return (
      <Layout>
        <section className="pt-32 pb-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="font-display font-bold text-3xl text-foreground">Industry not found</h1>
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
            <span className="text-foreground">{data.title}</span>
          </nav>
        </div>
      </div>

      <section className="pt-8 pb-20 relative" ref={sectionRef}>
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl" data-reveal>
            <span className="text-xs font-mono text-primary uppercase tracking-widest">{data.title} Industry</span>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl text-foreground mt-4 mb-6 leading-tight">{data.tagline}</h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">{data.description}</p>
            <div className="mt-8 flex gap-3">
              <Link to="/get-proposal"><Button className="rounded-full px-8 font-display font-semibold">Get A Proposal</Button></Link>
              <Link to="/contact"><Button variant="outline" className="rounded-full px-8 font-display font-semibold border-border/40">Talk to an Expert</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-border/30">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-10" data-reveal>
            Industry <span className="text-gradient">Challenges</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.challenges.map(c => (
              <div key={c} className="flex items-start gap-3 rounded-xl glass border border-border/30 p-5">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-10">
            How We Help <span className="text-gradient">{data.title}</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.services.map(s => (
              <Link key={s.href} to={s.href} className="group rounded-2xl glass border border-border/30 p-6 hover:border-primary/20 transition-all duration-500">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-display font-semibold text-foreground">{s.title}</h3>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-10 text-center">
            Case Study <span className="text-gradient">Highlight</span>
          </h2>
          <div className="max-w-2xl mx-auto rounded-2xl glass border border-primary/15 p-8 text-center">
            <span className="font-display font-extrabold text-5xl text-gradient">{data.caseStudy.metric}</span>
            <p className="text-xs text-muted-foreground font-mono mt-1 mb-4">{data.caseStudy.metricLabel}</p>
            <h3 className="font-display font-bold text-xl text-foreground mb-2">{data.caseStudy.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{data.caseStudy.desc}</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
            Ready to Grow Your <span className="text-gradient">{data.title}</span> Business?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">Let's build a custom strategy tailored to your industry.</p>
          <Link to="/get-proposal"><Button size="lg" className="rounded-full px-10 font-display font-semibold">Get Your Free Proposal →</Button></Link>
        </div>
      </section>
    </Layout>
  );
}
