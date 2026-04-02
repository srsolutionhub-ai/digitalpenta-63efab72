import { Star, Quote } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const testimonials = [
  {
    quote: "Digital Penta transformed our digital presence completely. The integrated approach across marketing and development delivered 3x the results we expected.",
    name: "Rajesh Kumar",
    role: "CEO, PropTech Ventures",
    rating: 5,
    featured: true,
  },
  {
    quote: "Their understanding of both Indian and Middle Eastern markets is unmatched. Our brand visibility in Dubai grew 400% in just six months.",
    name: "Fatima Al-Hassan",
    role: "Marketing Director, Gulf Retail Group",
    rating: 5,
  },
  {
    quote: "The AI-powered automation they built saved us 200+ hours per month. ROI was visible within the first quarter.",
    name: "Amit Sharma",
    role: "Founder, HealthTech Solutions",
    rating: 5,
  },
  {
    quote: "From PR crisis management to rebuilding our online reputation — they handled everything with precision and speed.",
    name: "Sarah Chen",
    role: "VP Communications, FinServe Global",
    rating: 5,
  },
  {
    quote: "Best development team we've worked with. Our e-commerce platform handles 10x the traffic now with zero downtime.",
    name: "Omar Al-Rashid",
    role: "CTO, Souq Digital",
    rating: 5,
  },
  {
    quote: "They don't just execute — they think strategically. That's rare in this industry.",
    name: "Priya Patel",
    role: "CMO, EduLearn India",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>();
  const featured = testimonials.find(t => t.featured);
  const others = testimonials.filter(t => !t.featured);

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4" ref={sectionRef}>
        <div className="text-center max-w-2xl mx-auto mb-16" data-reveal>
          <span className="text-xs font-mono text-primary uppercase tracking-widest">Testimonials</span>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-foreground mt-3 mb-4">
            Trusted by <span className="text-gradient">Industry Leaders</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {/* Featured testimonial */}
          {featured && (
            <div data-reveal className="lg:col-span-2 rounded-2xl glass border border-primary/15 p-8 relative overflow-hidden">
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
              <p className="font-display font-bold text-foreground">{featured.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{featured.role}</p>
            </div>
          )}

          {/* Other testimonials */}
          <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
            {others.slice(0, 4).map((t) => (
              <div
                key={t.name}
                data-reveal
                className="rounded-2xl glass border border-border/30 p-6 hover:bg-card/60 hover:border-primary/15 transition-all duration-500"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-5">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-display font-semibold text-foreground">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
