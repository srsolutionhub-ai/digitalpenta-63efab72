import { Star, Quote, BadgeCheck, Play } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef, useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import React from "react";

const testimonials = [
  {
    quote: "Digital Penta took our salon from 0 to 2000 Instagram followers in 3 months and our booking rate doubled!",
    name: "Priya S.",
    role: "Beauty Salon Owner, Jaipur",
    rating: 5,
    featured: true,
    initials: "PS",
    color: "from-violet-500 to-purple-600",
    badge: "Verified Client",
  },
  {
    quote: "Best ROI we've ever seen on Google Ads. 4X return in the first month!",
    name: "Rahul M.",
    role: "E-commerce Founder, Delhi",
    rating: 5,
    initials: "RM",
    color: "from-cyan-500 to-blue-600",
    badge: "Google Review",
  },
  {
    quote: "Professional team, transparent reporting, and real results. Highly recommend for any growing business!",
    name: "Ankit T.",
    role: "Real Estate Developer, Mumbai",
    rating: 5,
    initials: "AT",
    color: "from-emerald-500 to-green-600",
    badge: "Verified Client",
  },
  {
    quote: "Their WhatsApp automation alone saved us 100+ hours per month. The ROI was visible within the first quarter.",
    name: "Sneha K.",
    role: "D2C Brand Founder, Bangalore",
    rating: 5,
    initials: "SK",
    color: "from-amber-500 to-orange-600",
    badge: "Verified Client",
  },
  {
    quote: "They don't just execute — they think strategically. Our organic traffic grew 312% in 6 months.",
    name: "Vikram P.",
    role: "SaaS Startup CEO, Pune",
    rating: 5,
    initials: "VP",
    color: "from-rose-500 to-pink-600",
    badge: "Google Review",
  },
];

const TiltCard = React.forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string }>(
  ({ children, className }, _forwardedRef) => {
    const [transform, setTransform] = useState("");
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMove = useCallback((e: React.MouseEvent) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTransform(`perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`);
    }, []);

    return (
      <div ref={cardRef} onMouseMove={handleMove} onMouseLeave={() => setTransform("")}
        style={{ transform, transition: transform ? "transform 0.1s ease" : "transform 0.4s ease" }}
        className={className}>
        {children}
      </div>
    );
  }
);
TiltCard.displayName = "TiltCard";

function Avatar({ initials, gradient }: { initials: string; gradient: string }) {
  return (
    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
      <span className="text-xs font-display font-bold text-primary-foreground">{initials}</span>
    </div>
  );
}

function StaggeredStars({ count, delay = 0 }: { count: number; delay?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: delay + i * 0.08, ease: "backOut" }}
        >
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        </motion.div>
      ))}
    </div>
  );
}

function VideoReviewCard() {
  return (
    <TiltCard className="rounded-2xl glass border border-border/30 p-6 hover:bg-card/60 hover:border-primary/15 transition-all duration-500 h-full flex flex-col items-center justify-center text-center min-h-[200px]">
      <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Play className="w-6 h-6 text-primary ml-0.5" />
      </div>
      <p className="font-display font-semibold text-sm text-foreground mb-1">Watch Video Reviews</p>
      <p className="text-[11px] text-muted-foreground">Hear from our clients directly</p>
      <span className="inline-flex items-center gap-1 text-[9px] font-mono text-accent mt-3">
        <BadgeCheck className="w-3 h-3" /> Coming Soon
      </span>
    </TiltCard>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const featured = testimonials.find(t => t.featured);
  const others = testimonials.filter(t => !t.featured);

  // Embla carousel for mobile
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);

    // Auto-scroll
    const interval = setInterval(() => {
      if (emblaApi.canScrollNext()) emblaApi.scrollNext();
      else emblaApi.scrollTo(0);
    }, 4000);

    return () => { emblaApi.off("select", onSelect); clearInterval(interval); };
  }, [emblaApi]);

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4" ref={sectionRef}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-mono text-primary uppercase tracking-widest">Testimonials</span>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-foreground mt-3 mb-4">
            100+ Brands. Real Results. <span className="text-gradient">Real Reviews.</span>
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
              <TiltCard className="rounded-2xl glass border border-primary/15 p-8 relative overflow-hidden h-full">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                <Quote className="w-10 h-10 text-primary/20 mb-6" />
                <p className="text-lg font-display font-medium text-foreground/90 leading-relaxed mb-8">"{featured.quote}"</p>
                <StaggeredStars count={featured.rating} delay={0.3} />
                <div className="flex items-center gap-3 mt-4">
                  <Avatar initials={featured.initials} gradient={featured.color} />
                  <div>
                    <p className="font-display font-bold text-foreground">{featured.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{featured.role}</p>
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-mono text-accent">
                    <BadgeCheck className="w-3 h-3" /> {featured.badge}
                  </span>
                </div>
              </TiltCard>
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
                <TiltCard className="rounded-2xl glass border border-border/30 p-6 hover:bg-card/60 hover:border-primary/15 transition-all duration-500 h-full">
                  <StaggeredStars count={t.rating} delay={0.2 + i * 0.1} />
                  <p className="text-sm text-foreground/80 leading-relaxed mb-5 mt-3">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar initials={t.initials} gradient={t.color} />
                    <div>
                      <p className="text-sm font-display font-semibold text-foreground">{t.name}</p>
                      <p className="text-[11px] text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono text-accent mt-3">
                    <BadgeCheck className="w-3 h-3" /> {t.badge}
                  </span>
                </TiltCard>
              </motion.div>
            ))}
            {/* Video card placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <VideoReviewCard />
            </motion.div>
          </div>
        </div>

        {/* Mobile carousel */}
        <div className="lg:hidden">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {testimonials.map((t, i) => (
                <div key={t.name} className="flex-[0_0_85%] min-w-0">
                  <div className="rounded-2xl glass border border-border/30 p-6 h-full">
                    <StaggeredStars count={t.rating} delay={0.1} />
                    <p className="text-sm text-foreground/80 leading-relaxed mb-5 mt-3">"{t.quote}"</p>
                    <div className="flex items-center gap-3">
                      <Avatar initials={t.initials} gradient={t.color} />
                      <div>
                        <p className="text-sm font-display font-semibold text-foreground">{t.name}</p>
                        <p className="text-[11px] text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono text-accent mt-3">
                      <BadgeCheck className="w-3 h-3" /> {t.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === selectedIndex ? "bg-primary w-6" : "bg-border"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
