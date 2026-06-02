import logo from "@/assets/digital-penta-logo.png";

/**
 * Branded route loader — replaces the generic spinner.
 * Pulsing logo + 3-line skeleton bar. CSS-only, no JS animation cost.
 * Used as the Suspense fallback for lazy-loaded routes.
 */
export default function BrandedLoader() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-6 py-20"
    >
      <div className="relative">
        <div
          className="absolute inset-0 rounded-full blur-xl animate-pulse-glow"
          style={{ background: "radial-gradient(circle, hsl(256 90% 62% / 0.5), transparent 70%)" }}
          aria-hidden
        />
        <img
          src={logo}
          alt=""
          width={56}
          height={56}
          className="relative w-14 h-14 object-contain animate-breathe"
        />
      </div>
      <div className="flex flex-col items-center gap-2 w-full max-w-xs">
        <div className="h-2 w-40 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full w-1/3 rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, hsl(256 90% 62%), transparent)",
              animation: "shimmer 1.8s ease-in-out infinite",
            }}
          />
        </div>
        <div className="h-1.5 w-28 rounded-full bg-white/[0.04]" />
        <div className="h-1.5 w-20 rounded-full bg-white/[0.04]" />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
