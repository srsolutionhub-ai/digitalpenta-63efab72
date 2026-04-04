import { useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ParticleFieldProps {
  count?: number;
  className?: string;
}

export default function ParticleField({ count = 30, className = "" }: ParticleFieldProps) {
  const isMobile = useIsMobile();
  const actualCount = isMobile ? Math.min(count, 15) : count;

  const particles = useMemo(() => {
    return Array.from({ length: actualCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 8,
      duration: Math.random() * 6 + 6,
      opacity: Math.random() * 0.4 + 0.1,
    }));
  }, [actualCount]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-primary/30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `floatParticle ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
