import { useRef, useState, useCallback, type ReactNode } from "react";

interface MagneticCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export default function MagneticCard({ children, className = "", intensity = 5 }: MagneticCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");

  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * intensity;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * intensity;
    setTransform(`translate(${x}px, ${y}px)`);
  }, [intensity]);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setTransform("")}
      style={{ transform, transition: transform ? "transform 0.15s ease" : "transform 0.4s ease-out" }}
      className={className}
    >
      {children}
    </div>
  );
}
