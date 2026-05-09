/**
 * Decorative floating geometric shapes (SVG, CSS-animated).
 * Pointer-events disabled. Disabled by reduced-motion via CSS.
 * Zero JS runtime cost.
 */
export default function FloatingShapes({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Ring */}
      <svg
        className="absolute left-[6%] top-[18%] w-20 h-20 opacity-40 motion-safe:animate-[drift_18s_ease-in-out_infinite]"
        viewBox="0 0 80 80" fill="none"
      >
        <circle cx="40" cy="40" r="34" stroke="hsl(256 90% 75% / 0.6)" strokeWidth="0.8" strokeDasharray="2 4" />
      </svg>
      {/* Triangle */}
      <svg
        className="absolute right-[8%] top-[28%] w-16 h-16 opacity-40 motion-safe:animate-[drift_22s_ease-in-out_-6s_infinite]"
        viewBox="0 0 64 64" fill="none"
      >
        <polygon points="32,4 60,58 4,58" stroke="hsl(192 95% 70% / 0.55)" strokeWidth="0.8" fill="none" />
      </svg>
      {/* Square */}
      <svg
        className="absolute left-[14%] bottom-[14%] w-14 h-14 opacity-40 motion-safe:animate-[drift_26s_ease-in-out_-12s_infinite]"
        viewBox="0 0 56 56" fill="none"
      >
        <rect x="6" y="6" width="44" height="44" stroke="hsl(322 90% 75% / 0.5)" strokeWidth="0.8" transform="rotate(12 28 28)" />
      </svg>
      {/* Glow dot */}
      <div
        className="absolute right-[18%] bottom-[22%] w-2 h-2 rounded-full motion-safe:animate-[float_7s_ease-in-out_infinite]"
        style={{
          background: "hsl(256 90% 75%)",
          boxShadow: "0 0 24px 4px hsl(256 90% 62% / 0.7)",
        }}
      />
      {/* Plus */}
      <svg
        className="absolute right-[26%] top-[58%] w-10 h-10 opacity-30 motion-safe:animate-[drift_30s_ease-in-out_-3s_infinite]"
        viewBox="0 0 40 40" fill="none"
      >
        <path d="M20 6v28M6 20h28" stroke="hsl(162 100% 60% / 0.7)" strokeWidth="1" strokeLinecap="round" />
      </svg>
    </div>
  );
}
