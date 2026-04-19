import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Sparkles } from "lucide-react";

/**
 * SEO-critical H2 section that follows the Hero on the homepage.
 *
 * Carries the master-plan keyword cluster ("Full-Service Digital Marketing
 * in Delhi & India") in an H2 so Google indexes the primary topical phrase
 * immediately after the H1 in the Hero.
 */
export default function HomeIntroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 md:py-28 relative">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="inline-flex items-center gap-2 type-label text-primary font-mono">
            <Sparkles className="w-3.5 h-3.5" /> India · UAE · KSA · Qatar · Bahrain
          </span>
          <h2 className="font-display type-h2 text-foreground mt-4 mb-5">
            Full-Service Digital Marketing in{" "}
            <span className="text-primary">Delhi &amp; India</span>
          </h2>
          <p className="type-body max-w-2xl mx-auto">
            From SEO and Google Ads to AI automation and full-stack web development,
            Digital Penta is the integrated growth partner trusted by 500+ ambitious
            brands across India and the Middle East. One team, five disciplines, real
            ROI — measured in revenue, not vanity metrics.
          </p>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { v: "500+", l: "Brands Scaled" },
              { v: "₹120Cr+", l: "Revenue Driven" },
              { v: "4.9★", l: "Google Rating" },
              { v: "47 min", l: "Avg. Response" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-2xl card-surface p-5 text-center hover-lift"
              >
                <p className="font-display font-extrabold text-2xl text-primary">
                  {s.v}
                </p>
                <p className="type-label text-muted-foreground mt-1 font-mono">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
