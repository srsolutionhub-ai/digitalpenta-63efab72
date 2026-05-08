import Layout from "@/components/layout/Layout";
import SEOHead, { breadcrumbSchema, organizationSchema } from "@/components/seo/SEOHead";
import { Shield, Lock, Server, FileCheck, Clock, Globe } from "lucide-react";

const POSTURE = [
  { icon: Lock, title: "Encryption", body: "TLS 1.3 in transit, AES-256 at rest. All client data isolated per-account with row-level-security." },
  { icon: Server, title: "Infrastructure", body: "Hosted on Supabase + Lovable Cloud (AWS-backed). EU-resident DB option available for GDPR-sensitive customers." },
  { icon: FileCheck, title: "Compliance", body: "DPDP-aligned (India), GDPR-aligned (EU), under-active SOC 2 Type II preparation." },
  { icon: Shield, title: "Access control", body: "Role-based access (super_admin, account_manager, finance, content_writer, client). MFA enforced on all admin accounts." },
  { icon: Clock, title: "Backups & uptime", body: "Daily snapshots, point-in-time recovery, 99.9% target uptime with monitored health checks." },
  { icon: Globe, title: "Sub-processors", body: "Supabase, Resend, Lovable AI Gateway, Cloudflare. Full list available on request." },
];

const FAQS = [
  { q: "Where is client data stored?", a: "By default in our Supabase project (AWS Mumbai region). EU-region instances available on enterprise plans for GDPR-sensitive workloads." },
  { q: "Can we sign a DPA?", a: "Yes — every client engagement comes with a signed Data Processing Agreement and standard contractual clauses where required." },
  { q: "How do you handle data subject requests (DSR)?", a: "DSRs (access, rectification, erasure) are honoured within 30 days. Request via support@digitalpenta.com or our /contact page." },
  { q: "What's your incident response process?", a: "We notify affected clients within 72 hours of confirmation, with a written post-mortem inside 14 days for any P0/P1 incident." },
];

export default function Trust() {
  return (
    <Layout>
      <SEOHead
        title="Trust & Security | Digital Penta — How We Protect Client Data"
        description="Digital Penta's security posture, sub-processors, compliance certifications and incident response process. Built for enterprise-grade trust."
        canonical="https://digitalpenta.com/trust"
        schemas={[
          breadcrumbSchema([
            { name: "Home", url: "https://digitalpenta.com/" },
            { name: "Trust & Security", url: "https://digitalpenta.com/trust" },
          ]),
          organizationSchema(),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
        ]}
      />

      <section className="pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <Shield className="w-10 h-10 mx-auto text-primary mb-3" />
          <p className="type-label text-primary mb-3 font-mono">Trust Center</p>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4">Security &amp; compliance, by design.</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We treat your customer data like our own balance sheet. Encryption, access controls, audit logs and 24-hour incident response — built in from day one.
          </p>
        </div>
      </section>

      <section className="pb-12">
        <div className="container mx-auto px-4 max-w-5xl grid md:grid-cols-2 gap-4">
          {POSTURE.map((p, i) => (
            <div key={i} className="card-premium p-6">
              <p.icon className="w-6 h-6 text-primary mb-3" />
              <h2 className="font-display font-bold text-lg text-foreground mb-1.5">{p.title}</h2>
              <p className="text-sm text-foreground/75 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-display font-bold text-2xl text-foreground mb-5 text-center">FAQs</h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={i} className="card-premium p-5">
                <div className="font-display font-semibold text-foreground mb-1">{f.q}</div>
                <p className="text-sm text-foreground/75">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
