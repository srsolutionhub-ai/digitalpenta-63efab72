import { motion, useInView } from "motion/react";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "How much does digital marketing cost in India?", a: "Digital marketing costs in India range from ₹15,000/month for startups to ₹5,00,000+/month for enterprise brands. At Digital Penta, our Starter plan begins at ₹9,999/month. The final cost depends on your goals, channels, and competition. We offer transparent pricing with no hidden fees." },
  { q: "How long does SEO take to show results?", a: "SEO typically shows initial improvements within 30-60 days, with significant organic growth in 3-6 months. Competitive keywords may take 6-12 months. We provide transparent weekly reporting so you can track progress from day one, and our clients see an average 340% increase in organic traffic." },
  { q: "Do you work with clients in Dubai and UAE?", a: "Yes! We serve clients across India and the Middle East including Dubai, Abu Dhabi, Riyadh, and Doha. Our remote-first teams deliver seamlessly across time zones with native Arabic-speaking PR and content specialists for the MENA region." },
  { q: "What makes Digital Penta different from other agencies?", a: "We integrate five disciplines — Marketing, PR, Development, AI & Automation — under one roof. No fragmented agencies, no communication gaps. Plus, we're ROI-obsessed: every campaign is tied to measurable KPIs. Our 95% client retention rate speaks for itself." },
  { q: "Do you offer performance-based pricing?", a: "Yes, for select services like PPC and performance marketing, we offer hybrid models with a base fee plus performance bonuses. This aligns our incentives with your success. Contact us to discuss what works best for your goals." },
  { q: "Can I see a live demo of your client dashboard?", a: "Absolutely! We offer a live walkthrough of our real-time client dashboard that shows traffic, leads, ad spend, ROAS, and more — all in one place. Book a free strategy call and we'll give you a full demo tailored to your industry." },
  { q: "Which industries do you specialize in?", a: "We have deep expertise in Real Estate, Healthcare, E-commerce/D2C, Finance/Fintech, SaaS, Education, and Hospitality. Our strategies are tailored to each industry's unique challenges, audience behavior, and competitive landscape." },
  { q: "How do I get started with Digital Penta?", a: "Getting started is easy: 1) Book a free 30-minute strategy call, 2) We'll conduct a website audit and competitor analysis, 3) Receive a custom growth plan with clear KPIs and pricing, 4) Approve and we launch within 7 days. No long-term contracts required." },
];

export default function FAQSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 md:py-36">
      <div className="container mx-auto px-4 max-w-3xl" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="type-label text-primary font-mono">FAQ</span>
          <h2 className="font-display type-h2 text-foreground mt-3 mb-4">
            Got Questions? <span className="text-primary">We've Got Answers.</span>
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
                className="rounded-xl card-surface px-6 data-[state=open]:ring-1 data-[state=open]:ring-primary/20 transition-all duration-300 group"
              >
                <AccordionTrigger className="text-sm font-display font-semibold text-foreground hover:no-underline py-5 text-left gap-4">
                  <div className="flex items-center gap-4">
                    <span className="type-label text-muted-foreground group-data-[state=open]:text-primary transition-colors shrink-0 w-6 font-mono">
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
