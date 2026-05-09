import { useEffect, useRef } from "react";

/**
 * GPU-accelerated cursor follower.
 * - Single element, single mousemove listener
 * - Uses transform: translate3d (compositor-only)
 * - Keeps the system cursor visible (we add an accent ring, not a replacement)
 * - No requestAnimationFrame loop, no mix-blend-mode, no global "cursor: none"
 * - Disabled on touch / coarse pointer / reduced motion
 */
export default function PremiumCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const enabledRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (coarse || reduced || "ontouchstart" in window) return;

    enabledRef.current = true;
    const ring = ringRef.current;
    if (!ring) return;

    let lastX = -100;
    let lastY = -100;

    const onMove = (e: PointerEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      ring.style.transform = `translate3d(${lastX}px, ${lastY}px, 0) translate(-50%, -50%)`;
      if (ring.style.opacity !== "1") ring.style.opacity = "1";
    };

    const onLeave = () => { ring.style.opacity = "0"; };
    const onDown = () => ring.classList.add("pc-down");
    const onUp = () => ring.classList.remove("pc-down");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ringRef}
      aria-hidden
      className="premium-cursor"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 28,
        height: 28,
        borderRadius: "50%",
        border: "1.5px solid hsl(256 90% 75% / 0.55)",
        boxShadow: "0 0 18px hsl(256 90% 62% / 0.35)",
        pointerEvents: "none",
        zIndex: 9999,
        opacity: 0,
        transition: "opacity 200ms ease, width 180ms ease, height 180ms ease, border-color 180ms ease",
        willChange: "transform",
        mixBlendMode: "normal",
      }}
    />
  );
}
