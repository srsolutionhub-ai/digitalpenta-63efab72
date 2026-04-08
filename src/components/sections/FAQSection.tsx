import { motion, useInView } from "motion/react";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How soon will I see results from digital marketing?",
    a: "Most clients see initial improvements within 30-60 days. SEO takes 3-6 months for significant organic growth, while paid ads can generate leads within the first week. We provide transparent weekly reporting so you can track progress from day one.",
  },
  {
    q: "Do you work with small businesses and startups?",
    a: "Absolutely! Our Starter plan begins at ₹9,999/month — designed specifically for small businesses, D2C brands, and early-stage startups. We scale our services as you grow.",
  },
  {
    q: "What makes Digital Penta different from other agencies?",
    a: "We integrate five disciplines — Marketing, PR, Development, AI & Automation — under one roof. No fragmented agencies, no communication gaps. Plus, we're ROI-obsessed: every campaign is tied to measurable KPIs.",
  },
  {
    q: "Do you offer performance-based pricing?",
    a: "Yes, for select services like PPC and performance marketing, we offer hybrid models with a base fee plus performance bonuses. Contact us to discuss what works best for your goals.",
  },
  {
    q: "Which industries do you specialize in?",
    a: "We have deep expertise in Real Estate, Healthcare, E-commerce/D2C, Finance/Fintech, SaaS, Education, and Hospitality. Our strategies are tailored to each industry's unique challenges.",
  },
  {
    q: "How do you report results and track ROI?",
    a: "You get a dedicated dashboard with real-time analytics, plus bi-weekly or monthly detailed reports. We track every metric that matters — leads, conversions, ROAS, organic rankings, and more.",
  },
  {
    q: "Can I start with just one service?",
    a: "Of course! Many clients start with one pillar (like SEO or social media) and expand as they see results. Our modular approach lets you scale at your own pace.",
  },
  {
    q: "Do you work with clients outside Delhi/India?",
    a: "Yes! We serve clients across India and the Middle East (Dubai, Abu Dhabi, Riyadh, Doha). Our remote-first teams deliver seamlessly across time zones.",
  },
];

export default function FAQSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4 max-w-3xl" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-primary uppercase tracking-widest">FAQ</span>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-foreground mt-3 mb-4">
            Got Questions? <span className="text-gradient">We've Got Answers.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-xl glass border border-border/30 px-6 data-[state=open]:border-primary/20 transition-all duration-300 hover:bg-card/40 group"
              >
                <AccordionTrigger className="text-sm font-display font-semibold text-foreground hover:no-underline py-5 text-left gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-primary/40 group-data-[state=open]:text-primary transition-colors shrink-0 w-6">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {faq.q}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5 pl-10">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
