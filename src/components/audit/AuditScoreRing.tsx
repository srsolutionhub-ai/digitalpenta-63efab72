import { cn } from "@/lib/utils";

interface AuditScoreRingProps {
  score: number;
  label: string;
  size?: number;
}

function scoreColor(score: number) {
  if (score >= 90) return "hsl(160 84% 45%)";
  if (score >= 50) return "hsl(38 92% 55%)";
  return "hsl(0 84% 60%)";
}

export function AuditScoreRing({ score, label, size = 120 }: AuditScoreRingProps) {
  const radius = (size - 14) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeScore = Math.max(0, Math.min(100, score || 0));
  const offset = circumference - (safeScore / 100) * circumference;
  const color = scoreColor(safeScore);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="hsl(var(--muted))"
            strokeWidth={8}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={8}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-display text-2xl font-bold")} style={{ color }}>
            {safeScore}
          </span>
        </div>
      </div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
