import Layout from "@/components/layout/Layout";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, ArrowUpRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getIndustryData } from "@/data/industryData";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import MagneticCard from "@/components/ui/magnetic-card";
import SEOHead, {
  breadcrumbSchema, serviceSchema,
} from "@/components/seo/SEOHead";

const ease = [0.16, 1, 0.3, 1] as const;

export default function IndustryPage() {
  const { industry } = useParams<{ industry: string }>();
  const data = getIndustryData(industry || "");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

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

  const canonical = `https://digitalpenta.com/industries/${industry}`;
  const title = `Digital Marketing for ${data.title} in India | Digital Penta`;

  return (
    <Layout>
      <SEOHead
        title={title}
        description={data.metaDescription}
        canonical={canonical}
        hreflangs={[
          { hreflang: "x-default", href: canonical },
          { hreflang: "en", href: canonical },
          { hreflang: "en-IN", href: canonical },
          { hreflang: "en-AE", href: canonical },
        ]}
        schemas={[
          serviceSchema({
            name: `${data.title} Digital Marketing`,
            description: data.description,
            url: canonical,
            serviceType: `${data.title} Marketing`,
          }),
          breadcrumbSchema([
            { name: "Home", url: "https://digitalpenta.com/" },
            { name: "Industries", url: "https://digitalpenta.com/#industries" },
            { name: data.title, url: canonical },
          ]),
        ]}
      />
      <div className="pt-24 pb-0">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{data.title}</span>
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
            <span className="text-xs font-mono text-primary uppercase tracking-widest">{data.title} Industry</span>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl text-foreground mt-4 mb-6 leading-tight">{data.tagline}</h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">{data.description}</p>
            <div className="mt-8 flex gap-3">
              <Link to="/get-proposal"><Button className="rounded-full px-8 font-display font-semibold">Get A Proposal</Button></Link>
              <Link to="/contact"><Button variant="outline" className="rounded-full px-8 font-display font-semibold border-border/40">Talk to an Expert</Button></Link>
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
            Industry <span className="text-gradient">Challenges</span>
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.challenges.map((c, i) => (
              <motion.div
                key={c}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06, ease }}
                className="flex items-start gap-3 rounded-xl glass border border-border/30 p-5 hover:border-primary/20 transition-all duration-500"
              >
                <span className="text-[10px] font-mono text-primary/60 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">{c}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="font-display font-bold text-2xl md:text-3xl text-foreground mb-10"
          >
            How We Help <span className="text-gradient">{data.title}</span>
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.services.map((s, i) => (
              <motion.div
                key={s.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07, ease }}
              >
                <MagneticCard className="h-full">
                  <Link to={s.href} className="group block rounded-2xl glass border border-border/30 p-6 hover:border-primary/20 transition-all duration-500 shimmer-border h-full">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-display font-semibold text-foreground">{s.title}</h3>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </Link>
                </MagneticCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="font-display font-bold text-2xl md:text-3xl text-foreground mb-10 text-center"
          >
            Case Study <span className="text-gradient">Highlight</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="max-w-2xl mx-auto rounded-2xl glass border border-primary/15 p-8 text-center relative"
          >
            <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[120px] font-display font-extrabold text-foreground/[0.03] leading-none pointer-events-none select-none">
              {data.caseStudy.metric}
            </span>
            <span className="font-display font-extrabold text-5xl text-gradient relative z-10">{data.caseStudy.metric}</span>
            <p className="text-xs text-muted-foreground font-mono mt-1 mb-4">{data.caseStudy.metricLabel}</p>
            <h3 className="font-display font-bold text-xl text-foreground mb-2">{data.caseStudy.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{data.caseStudy.desc}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-card/20 relative overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
              Ready to Grow Your <span className="text-gradient">{data.title}</span> Business?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">Let's build a custom strategy tailored to your industry.</p>
            <Link to="/get-proposal"><Button size="lg" className="rounded-full px-10 font-display font-semibold">Get Your Free Proposal →</Button></Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
