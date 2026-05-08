import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEOHead, { breadcrumbSchema, organizationSchema } from "@/components/seo/SEOHead";
import { Sparkles, Target, Heart, Compass } from "lucide-react";

const PRINCIPLES = [
  { icon: Target, title: "Revenue is the only metric", body: "Every dashboard, every report, every quarterly review starts with revenue impact. Vanity metrics are appendices, not headlines." },
  { icon: Heart, title: "Senior strategists, every retainer", body: "You will never be handed off to a junior. The strategist who sold you the engagement runs the engagement." },
  { icon: Compass, title: "Compounding > campaigns", body: "We optimise for systems that compound across quarters — content engines, attribution stacks, brand equity — not one-off media buys." },
  { icon: Sparkles, title: "AI as a force multiplier", body: "We deploy AI where it makes our humans better — research, ideation, QA, personalisation — never as a substitute for senior judgement." },
];

export default function Manifesto() {
  return (
    <Layout>
      <SEOHead
        title="Our Manifesto | Digital Penta — Built for Compounding Growth"
        description="The four principles that define how Digital Penta builds compounding marketing engines for India and the Middle East's most ambitious brands."
        canonical="https://digitalpenta.com/manifesto"
        schemas={[
          breadcrumbSchema([
            { name: "Home", url: "https://digitalpenta.com/" },
            { name: "Manifesto", url: "https://digitalpenta.com/manifesto" },
          ]),
          organizationSchema(),
        ]}
      />
      <section className="pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <p className="type-label text-primary mb-3 font-mono">Our Manifesto</p>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl text-foreground mb-5 leading-tight">
            We build <span className="text-gradient">marketing engines</span>, not campaigns.
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Most agencies sell deliverables. We sell compounding outcomes. These four principles guide every retainer, every report, every late-night sprint.
          </p>
        </div>
      </section>
      <section className="pb-24">
        <div className="container mx-auto px-4 max-w-4xl space-y-5">
          {PRINCIPLES.map((p, i) => (
            <div key={i} className="card-premium p-7">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <p.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-mono text-[11px] text-muted-foreground mb-1">Principle {String(i + 1).padStart(2, "0")}</div>
                  <h2 className="font-display font-bold text-2xl text-foreground mb-2">{p.title}</h2>
                  <p className="text-foreground/75 leading-relaxed">{p.body}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="text-center pt-6">
            <Link to="/get-proposal" className="text-primary font-display font-semibold inline-flex items-center gap-2">
              See if we're a fit → <span>Request a proposal</span>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
