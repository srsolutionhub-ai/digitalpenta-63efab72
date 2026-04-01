import Layout from "@/components/layout/Layout";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getSubServiceData } from "@/data/subServiceData";

export default function SubServicePage() {
  const { category, subService } = useParams<{ category: string; subService: string }>();
  const data = getSubServiceData(category || "", subService || "");

  if (!data) {
    return (
      <Layout>
        <section className="pt-32 pb-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="font-display font-bold text-3xl text-foreground">Service not found</h1>
            <Link to={`/services/${category}`} className="text-primary text-sm mt-4 inline-block">← Back to Category</Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="pt-24 pb-0">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={`/services/${category}`} className="hover:text-foreground transition-colors capitalize">
              {category?.replace(/-/g, " ")}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{data.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="pt-8 pb-20 relative">
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className={`text-xs font-mono uppercase tracking-widest ${data.accentClass}`}>{data.title}</span>
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 mb-6">
              {data.heroTagline}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">{data.heroDescription}</p>
            <div className="mt-8 flex gap-3">
              <Link to="/get-proposal">
                <Button className="rounded-full px-8 font-display font-semibold">{data.cta}</Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="rounded-full px-8 font-display font-semibold border-border/60">Talk to an Expert</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-10">
            What We <span className="text-gradient">Deliver</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {data.benefits.map(b => (
              <div key={b.title} className="rounded-xl glass glow-border p-6">
                <h3 className="font-display font-semibold text-foreground mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-16 bg-card/20">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-10 text-center">
            Key <span className="text-gradient">Features</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {data.features.map(f => (
              <div key={f} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-10 text-center">
            Our <span className="text-gradient">Process</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {data.process.map((p, i) => (
              <div key={p.step} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <span className="font-mono text-sm font-bold text-primary">{i + 1}</span>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground text-sm">{p.step}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-card/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display font-semibold text-lg text-foreground mb-6">Common Use Cases</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {data.useCases.map(u => (
              <span key={u} className="px-4 py-2 rounded-full glass text-xs font-mono text-muted-foreground">{u}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-10 text-center">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <Accordion type="single" collapsible>
            {data.faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-border/50">
                <AccordionTrigger className="font-display text-foreground text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Let's build a custom {data.title.toLowerCase()} strategy tailored to your business goals.
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/get-proposal">
              <Button size="lg" className="rounded-full px-10 font-display font-semibold">
                {data.cta} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
