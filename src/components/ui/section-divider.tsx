/**
 * Slim, premium section dividers — pure CSS/SVG, no JS.
 * Variants:
 *  - aurora: gradient hairline + soft glow
 *  - seam: dashed line with center diamond
 *  - spark: gradient line with pulsing center dot
 */
type Variant = "aurora" | "seam" | "spark";

export default function SectionDivider({
  variant = "aurora",
  className = "",
}: { variant?: Variant; className?: string }) {
  return (
    <div aria-hidden className={`relative w-full py-10 ${className}`}>
      <div className="container mx-auto px-4">
        {variant === "aurora" && (
          <div className="relative h-px w-full">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, hsl(256 90% 62% / 0.5) 30%, hsl(322 90% 62% / 0.55) 50%, hsl(192 95% 56% / 0.5) 70%, transparent 100%)",
              }}
            />
            <div
              className="absolute -inset-y-3 left-1/2 -translate-x-1/2 w-1/2 blur-2xl opacity-40"
              style={{ background: "radial-gradient(closest-side, hsl(256 90% 62% / 0.45), transparent)" }}
            />
          </div>
        )}

        {variant === "seam" && (
          <div className="relative flex items-center gap-4 text-foreground/30">
            <div className="flex-1 border-t border-dashed border-foreground/15" />
            <svg width="10" height="10" viewBox="0 0 10 10" className="text-primary/70">
              <rect x="3" y="3" width="4" height="4" transform="rotate(45 5 5)" fill="currentColor" />
            </svg>
            <div className="flex-1 border-t border-dashed border-foreground/15" />
          </div>
        )}

        {variant === "spark" && (
          <div className="relative flex items-center justify-center">
            <div
              className="h-px flex-1"
              style={{
                background: "linear-gradient(90deg, transparent, hsl(var(--foreground) / 0.12) 60%, transparent)",
              }}
            />
            <span
              className="relative mx-3 inline-block w-1.5 h-1.5 rounded-full motion-safe:animate-pulse-glow"
              style={{ background: "hsl(256 90% 70%)", boxShadow: "0 0 12px hsl(256 90% 62% / 0.8)" }}
            />
            <div
              className="h-px flex-1"
              style={{
                background: "linear-gradient(90deg, transparent, hsl(var(--foreground) / 0.12) 40%, transparent)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
