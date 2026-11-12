import { motion, useInView } from "motion/react";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { HOMEPAGE_FAQS } from "@/data/homepageFaqs";

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
          <span className="neon-chip">FAQ</span>
          <h2 className="font-display type-h2 text-foreground mt-5 mb-4">
            Frequently Asked <span className="text-gradient-hero">Questions</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {HOMEPAGE_FAQS.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="glass-card-pro px-6 transition-all duration-300 group border-0"
              >
                <AccordionTrigger className="text-sm font-display font-semibold text-foreground hover:no-underline py-5 text-left gap-4">
                  <div className="flex items-center gap-4">
                    <span className="type-label font-mono shrink-0 w-7 h-7 rounded-md flex items-center justify-center transition-all group-data-[state=open]:scale-110"
                      style={{
                        background: "linear-gradient(135deg, hsl(256 90% 62% / 0.18), hsl(192 95% 56% / 0.10))",
                        border: "1px solid hsl(256 90% 62% / 0.3)",
                        color: "hsl(192 100% 80%)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {faq.q}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5 pl-11">
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
