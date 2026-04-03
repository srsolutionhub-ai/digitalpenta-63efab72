interface MarqueeItem {
  label: string;
  icon?: string;
}

interface LogoMarqueeProps {
  items: MarqueeItem[];
  speed?: "normal" | "slow";
  reverse?: boolean;
  className?: string;
}

export default function LogoMarquee({ items, speed = "normal", reverse = false, className = "" }: LogoMarqueeProps) {
  const animClass = reverse
    ? speed === "slow" ? "animate-marquee-reverse" : "animate-marquee-reverse"
    : speed === "slow" ? "animate-marquee-slow" : "animate-marquee";

  const doubled = [...items, ...items];

  return (
    <div className={`overflow-hidden marquee-mask ${className}`}>
      <div className={`flex items-center gap-8 md:gap-12 whitespace-nowrap ${animClass}`} style={{ width: "max-content" }}>
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-2.5 px-4">
            {item.icon && <span className="text-lg">{item.icon}</span>}
            <span className="text-sm font-display font-medium text-muted-foreground/60">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
