import { Star, Quote, BadgeCheck, Play } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import testimonialsBanner from "@/assets/testimonials-banner-graphic.jpg";

const testimonials = [
  { quote: "Digital Penta took our salon from 0 to 2000 Instagram followers in 3 months and our booking rate doubled!", name: "Priya S.", role: "Beauty Salon Owner, Jaipur", rating: 5, featured: true, initials: "PS", badge: "Verified Client", accent: "hsl(322 90% 62%)" },
  { quote: "Best ROI we've ever seen on Google Ads. 4X return in the first month!", name: "Rahul M.", role: "E-commerce Founder, Delhi", rating: 5, initials: "RM", badge: "Google Review", accent: "hsl(192 95% 56%)" },
  { quote: "Professional team, transparent reporting, and real results. Highly recommend for any growing business!", name: "Ankit T.", role: "Real Estate Developer, Mumbai", rating: 5, initials: "AT", badge: "Verified Client", accent: "hsl(162 100% 44%)" },
  { quote: "Their WhatsApp automation alone saved us 100+ hours per month. The ROI was visible within the first quarter.", name: "Sneha K.", role: "D2C Brand Founder, Bangalore", rating: 5, initials: "SK", badge: "Verified Client", accent: "hsl(256 90% 62%)" },
  { quote: "They don't just execute — they think strategically. Our organic traffic grew 312% in 6 months.", name: "Vikram P.", role: "SaaS Startup CEO, Pune", rating: 5, initials: "VP", badge: "Google Review", accent: "hsl(38 100% 60%)" },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" style={{ filter: "drop-shadow(0 0 4px hsl(48 100% 60% / 0.6))" }} />
      ))}
    </div>
  );
}

function Avatar({ initials, accent }: { initials: string; accent: string }) {
  return (
    <div
      className="w-11 h-11 rounded-full flex items-center justify-center relative"
      style={{
        background: `linear-gradient(135deg, ${accent}40, ${accent}15)`,
        border: `1px solid ${accent}60`,
        boxShadow: `0 0 16px -2px ${accent}60`,
      }}
    >
      <span className="text-xs font-display font-bold" style={{ color: accent, filter: `drop-shadow(0 0 4px ${accent}80)` }}>
        {initials}
      </span>
    </div>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const featured = testimonials.find(t => t.featured)!;
  const others = testimonials.filter(t => !t.featured);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    const interval = setInterval(() => {
      if (emblaApi.canScrollNext()) emblaApi.scrollNext();
      else emblaApi.scrollTo(0);
    }, 4000);
    return () => { emblaApi.off("select", onSelect); clearInterval(interval); };
  }, [emblaApi]);

  return (
    <section className="py-28 md:py-36 relative overflow-hidden">
      {/* Ambient bg */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={testimonialsBanner}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center opacity-[0.12]"
          loading="lazy"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" />
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(60% 50% at 25% 50%, hsl(322 90% 35% / 0.18), transparent 60%), radial-gradient(50% 50% at 75% 50%, hsl(256 90% 35% / 0.18), transparent 60%)" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10" ref={sectionRef}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <span className="neon-chip">Testimonials</span>
          <h2 className="font-display type-h2 text-foreground mt-5 mb-4">
            100+ Brands. Real Results.{" "}
            <span className="text-gradient-hero">Real Reviews.</span>
          </h2>
        </motion.div>

        {/* Desktop layout */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="glass-card-featured p-8 h-full relative">
                <div className="relative z-10">
                  <Quote className="w-12 h-12 mb-6" style={{ color: featured.accent, filter: `drop-shadow(0 0 14px ${featured.accent}80)` }} />
                  <p className="text-lg font-display font-medium text-foreground/95 leading-relaxed mb-8">"{featured.quote}"</p>
                  <Stars count={featured.rating} />
                  <div className="flex items-center gap-3 mt-4">
                    <Avatar initials={featured.initials} accent={featured.accent} />
                    <div>
                      <p className="font-display font-bold text-foreground">{featured.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{featured.role}</p>
                    </div>
                    <span className="ml-auto inline-flex items-center gap-1 type-label font-mono"
                      style={{ color: featured.accent }}
                    >
                      <BadgeCheck className="w-3 h-3" /> {featured.badge}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
            {others.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.08 }}
              >
                <div className="glass-card-pro p-6 h-full">
                  <Stars count={t.rating} />
                  <p className="text-sm text-foreground/85 leading-relaxed mb-5 mt-3">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar initials={t.initials} accent={t.accent} />
                    <div>
                      <p className="text-sm font-display font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 type-label font-mono mt-3" style={{ color: t.accent }}>
                    <BadgeCheck className="w-3 h-3" /> {t.badge}
                  </span>
                </div>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="glass-card-pro p-6 h-full flex flex-col items-center justify-center text-center min-h-[200px] group">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 relative"
                  style={{
                    background: "linear-gradient(135deg, hsl(256 90% 62% / 0.2), hsl(192 95% 56% / 0.15))",
                    border: "1px solid hsl(256 90% 62% / 0.4)",
                    boxShadow: "0 0 24px -4px hsl(256 90% 62% / 0.7)",
                  }}
                >
                  <Play className="w-6 h-6 text-primary ml-0.5" />
                </div>
                <p className="font-display font-semibold text-sm text-foreground mb-1">Watch Video Reviews</p>
                <p className="text-xs text-muted-foreground">Hear from our clients directly</p>
                <span className="inline-flex items-center gap-1 type-label text-accent font-mono mt-3">
                  <BadgeCheck className="w-3 h-3" /> Coming Soon
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile carousel */}
        <div className="lg:hidden">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {testimonials.map((t) => (
                <div key={t.name} className="flex-[0_0_85%] min-w-0">
                  <div className="glass-card-pro p-6 h-full">
                    <Stars count={t.rating} />
                    <p className="text-sm text-foreground/85 leading-relaxed mb-5 mt-3">"{t.quote}"</p>
                    <div className="flex items-center gap-3">
                      <Avatar initials={t.initials} accent={t.accent} />
                      <div>
                        <p className="text-sm font-display font-semibold text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 type-label font-mono mt-3" style={{ color: t.accent }}>
                      <BadgeCheck className="w-3 h-3" /> {t.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`h-1.5 rounded-full transition-all ${i === selectedIndex ? "w-7" : "w-1.5"}`}
                style={i === selectedIndex
                  ? { background: "linear-gradient(90deg, hsl(256 90% 62%), hsl(192 95% 56%))", boxShadow: "0 0 8px hsl(256 90% 62% / 0.7)" }
                  : { background: "rgba(255,255,255,0.18)" }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
