import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const categories = ["All", "Marketing", "PR", "Development", "AI", "Automation"];

const projects = [
  { title: "PropTech Lead Engine", client: "Skyline Properties", category: "Marketing", metric: "340% more leads", gradient: "from-violet-600/40 to-purple-900/40", tags: ["SEO", "PPC", "Automation"] },
  { title: "Gulf Retail Brand Launch", client: "Gulf Retail Group", category: "PR", metric: "400% visibility", gradient: "from-cyan-600/40 to-blue-900/40", tags: ["Media Relations", "Digital PR"] },
  { title: "HealthTech Platform", client: "MediCare Plus", category: "Development", metric: "50K+ users", gradient: "from-emerald-600/40 to-green-900/40", tags: ["Web App", "UI/UX"] },
  { title: "AI Customer Support", client: "FinServe Global", category: "AI", metric: "80% automation", gradient: "from-amber-600/40 to-yellow-900/40", tags: ["Chatbot", "NLP"] },
  { title: "E-commerce Scaling", client: "Fashion Forward", category: "Marketing", metric: "8.2x ROAS", gradient: "from-pink-600/40 to-rose-900/40", tags: ["Social Media", "Performance"] },
  { title: "CRM Workflow Overhaul", client: "Realty Hub", category: "Automation", metric: "200hrs saved/mo", gradient: "from-orange-600/40 to-red-900/40", tags: ["CRM", "Workflow"] },
  { title: "Mobile Banking App", client: "NeoBank India", category: "Development", metric: "100K downloads", gradient: "from-blue-600/40 to-indigo-900/40", tags: ["Mobile App", "API"] },
  { title: "AI Content Pipeline", client: "EduLearn India", category: "AI", metric: "10x content output", gradient: "from-violet-600/40 to-fuchsia-900/40", tags: ["Content Gen", "AI Marketing"] },
  { title: "Crisis Recovery PR", client: "TechStart UAE", category: "PR", metric: "Reputation restored", gradient: "from-teal-600/40 to-cyan-900/40", tags: ["Crisis Mgmt", "Brand Reputation"] },
  { title: "WhatsApp Commerce Bot", client: "Souq Digital", category: "Automation", metric: "₹2Cr revenue", gradient: "from-green-600/40 to-emerald-900/40", tags: ["WhatsApp", "Sales"] },
];

export default function Portfolio() {
  const [active, setActive] = useState("All");
  const sectionRef = useScrollReveal<HTMLDivElement>();
  const filtered = active === "All" ? projects : projects.filter(p => p.category === active);

  return (
    <Layout>
      <section className="pt-32 pb-10 relative">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="container mx-auto px-4 relative z-10" ref={sectionRef}>
          <div className="max-w-3xl" data-reveal>
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Portfolio</span>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl text-foreground mt-4 mb-4">
              Our <span className="text-gradient">Work</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Real results for real brands. Explore how we've driven growth across industries and markets.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-5 py-2 rounded-full text-sm font-display font-medium transition-all border ${
                  active === c
                    ? "bg-primary/10 border-primary/30 text-foreground"
                    : "bg-secondary/30 border-border/30 text-muted-foreground hover:border-primary/20"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((p) => (
              <div
                key={p.title}
                className="group rounded-2xl glass border border-border/30 overflow-hidden hover:border-primary/20 hover:shadow-2xl transition-all duration-500"
              >
                <div className={`h-44 bg-gradient-to-br ${p.gradient} relative`}>
                  <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-xs font-display font-bold text-foreground">{p.metric}</span>
                  </div>
                </div>
                <div className="p-7">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{p.client}</span>
                  <h3 className="font-display font-bold text-xl text-foreground mt-1 mb-3 group-hover:text-primary transition-colors">{p.title}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map(t => (
                      <span key={t} className="text-[10px] px-2.5 py-1 rounded-full bg-secondary/60 text-secondary-foreground font-mono border border-border/20">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
