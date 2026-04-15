import Layout from "@/components/layout/Layout";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getSubServiceData } from "@/data/subServiceData";
import { motion } from "motion/react";
import { useEffect } from "react";

export default function SubServicePage() {
  const { category, subService } = useParams<{ category: string; subService: string }>();
  const data = getSubServiceData(category || "", subService || "");

  useEffect(() => {
    if (data) {
      document.title = `${data.title} Agency in Delhi | Digital Penta | 2026`;
    }
  }, [data]);

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
      {/* Service JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": data.title,
          "description": data.heroDescription,
          "provider": {
            "@type": "Organization",
            "name": "Digital Penta",
            "url": "https://digitalpenta.com"
          },
          "areaServed": [
            { "@type": "Country", "name": "India" },
            { "@type": "Country", "name": "United Arab Emirates" },
            { "@type": "Country", "name": "Saudi Arabia" }
          ],
          "url": `https://digitalpenta.com/services/${category}/${subService}`
        }) }}
      />
      {/* Breadcrumb */}
      <div className="pt-24 pb-0">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1 text-xs text-muted-foreground font-mono" aria-label="Breadcrumb">
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
      <section className="pt-8 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] rounded-full bg-primary/5 blur-[120px] animate-breathe" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className={`text-xs font-mono uppercase tracking-widest ${data.accentClass}`}>{data.title}</span>
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 mb-6">
              {data.heroTagline}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">{data.heroDescription}</p>
            <div className="mt-8 flex gap-3">
              <Link to="/get-proposal">
                <Button className="rounded-full px-8 font-display font-semibold bg-gradient-to-r from-[hsl(20,90%,50%)] to-[hsl(30,100%,45%)] hover:opacity-90 text-white shadow-lg shadow-orange-500/20">
                  {data.cta}
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="rounded-full px-8 font-display font-semibold border-border/60">Talk to an Expert</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 border-t border-border/30">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-10">
            What We <span className="text-gradient">Deliver</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {data.benefits.map((b, i) => (
              <motion.div
                key={b.title}
                className="rounded-xl glass glow-border p-6 hover:shadow-lg hover:shadow-primary/5 transition-shadow"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <h3 className="font-display font-semibold text-foreground mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </motion.div>
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
            {data.features.map((f, i) => (
              <motion.div
                key={f}
                className="flex items-start gap-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">{f}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 border-t border-border/30">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-10 text-center">
            Our <span className="text-gradient">Process</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {data.process.map((p, i) => (
              <motion.div
                key={p.step}
                className="flex gap-4"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <span className="font-mono text-sm font-bold text-primary">{i + 1}</span>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground text-sm">{p.step}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-card/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display font-semibold text-lg text-foreground mb-6">Common Use Cases</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {data.useCases.map((u, i) => (
              <motion.span
                key={u}
                className="px-4 py-2 rounded-full glass text-xs font-mono text-muted-foreground hover:text-foreground hover:border-primary/20 transition-all border border-transparent"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                {u}
              </motion.span>
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
                <AccordionTrigger className="font-display text-foreground text-left hover:text-primary transition-colors">
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-xs text-primary/40">{String(i + 1).padStart(2, "0")}</span>
                    {faq.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-9">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10" />
        <div className="absolute inset-0 mesh-gradient" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Let's build a custom {data.title.toLowerCase()} strategy tailored to your business goals.
            </p>
            <div className="flex justify-center gap-3">
              <Link to="/get-proposal">
                <Button size="lg" className="rounded-full px-10 font-display font-bold bg-gradient-to-r from-[hsl(20,90%,50%)] to-[hsl(30,100%,45%)] hover:opacity-90 text-white shadow-lg shadow-orange-500/20">
                  {data.cta} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
