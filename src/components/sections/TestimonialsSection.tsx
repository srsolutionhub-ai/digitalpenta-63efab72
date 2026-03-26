import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Digital Penta transformed our digital presence completely. The integrated approach across marketing and development delivered 3x the results we expected.",
    name: "Rajesh Kumar",
    role: "CEO, PropTech Ventures",
    rating: 5,
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
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono text-primary uppercase tracking-widest">Testimonials</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mt-3 mb-4">
            Trusted by <span className="text-gradient">Industry Leaders</span>
          </h2>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="break-inside-avoid rounded-xl glass p-6 hover:bg-card/60 transition-colors"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-4">"{t.quote}"</p>
              <div>
                <p className="text-sm font-display font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
