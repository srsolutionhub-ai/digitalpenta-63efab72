const industries = [
  "Real Estate", "Healthcare", "Education", "E-commerce", "Finance",
  "Hospitality", "SaaS", "Automotive", "FMCG", "Legal",
  "Real Estate", "Healthcare", "Education", "E-commerce", "Finance",
  "Hospitality", "SaaS", "Automotive", "FMCG", "Legal",
];

export default function IndustriesSection() {
  return (
    <section className="py-16 border-y border-border bg-card/20 overflow-hidden">
      <div className="container mx-auto px-4 mb-8 text-center">
        <span className="text-xs font-mono text-primary uppercase tracking-widest">Industries</span>
        <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mt-3">
          Expertise Across <span className="text-gradient">Sectors</span>
        </h2>
      </div>
      <div className="relative">
        <div className="flex animate-marquee">
          {industries.map((ind, i) => (
            <span
              key={`${ind}-${i}`}
              className="flex-shrink-0 mx-4 px-6 py-3 rounded-full glass text-sm font-display font-medium text-muted-foreground whitespace-nowrap"
            >
              {ind}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
