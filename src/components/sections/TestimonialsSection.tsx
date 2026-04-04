import { Star, Quote } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef, useState, useCallback } from "react";

const testimonials = [
  { quote: "Digital Penta transformed our digital presence completely. The integrated approach across marketing and development delivered 3x the results we expected.", name: "Rajesh Kumar", role: "CEO, PropTech Ventures", rating: 5, featured: true, initials: "RK", color: "from-violet-500 to-purple-600" },
  { quote: "Their understanding of both Indian and Middle Eastern markets is unmatched. Our brand visibility in Dubai grew 400% in just six months.", name: "Fatima Al-Hassan", role: "Marketing Director, Gulf Retail Group", rating: 5, initials: "FA", color: "from-cyan-500 to-blue-600" },
  { quote: "The AI-powered automation they built saved us 200+ hours per month. ROI was visible within the first quarter.", name: "Amit Sharma", role: "Founder, HealthTech Solutions", rating: 5, initials: "AS", color: "from-emerald-500 to-green-600" },
  { quote: "From PR crisis management to rebuilding our online reputation — they handled everything with precision and speed.", name: "Sarah Chen", role: "VP Communications, FinServe Global", rating: 5, initials: "SC", color: "from-amber-500 to-orange-600" },
  { quote: "Best development team we've worked with. Our e-commerce platform handles 10x the traffic now with zero downtime.", name: "Omar Al-Rashid", role: "CTO, Souq Digital", rating: 5, initials: "OA", color: "from-rose-500 to-pink-600" },
  { quote: "They don't just execute — they think strategically. That's rare in this industry.", name: "Priya Patel", role: "CMO, EduLearn India", rating: 5, initials: "PP", color: "from-indigo-500 to-violet-600" },
];

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
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

  const handleLeave = useCallback(() => setTransform(""), []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transform, transition: transform ? "transform 0.1s ease" : "transform 0.4s ease" }}
      className={className}
    >
      {children}
    </div>
  );
}

function Avatar({ initials, gradient }: { initials: string; gradient: string }) {
  return (
    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
      <span className="text-xs font-display font-bold text-primary-foreground">{initials}</span>
    </div>
  );
}

export default function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const featured = testimonials.find(t => t.featured);
  const others = testimonials.filter(t => !t.featured);

  return (
    <section className="py-24 md:py-32 cv-auto">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-mono text-primary uppercase tracking-widest">Testimonials</span>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-foreground mt-3 mb-4">
            Trusted by <span className="text-gradient">Industry Leaders</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-2"
            >
              <TiltCard className="rounded-2xl glass border border-primary/15 p-8 relative overflow-hidden h-full">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                <Quote className="w-10 h-10 text-primary/20 mb-6" />
                <p className="text-lg font-display font-medium text-foreground/90 leading-relaxed mb-8">
                  "{featured.quote}"
                </p>
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: featured.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <Avatar initials={featured.initials} gradient={featured.color} />
                  <div>
                    <p className="font-display font-bold text-foreground">{featured.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{featured.role}</p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          )}

          <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
            {others.slice(0, 4).map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard className="rounded-2xl glass border border-border/30 p-6 hover:bg-card/60 hover:border-primary/15 transition-all duration-500 h-full">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-5">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar initials={t.initials} gradient={t.color} />
                    <div>
                      <p className="text-sm font-display font-semibold text-foreground">{t.name}</p>
                      <p className="text-[11px] text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
