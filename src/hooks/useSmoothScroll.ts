import { useEffect } from "react";
import type LenisType from "lenis";

let lenisInstance: LenisType | null = null;

/**
 * Smooth scroll (Lenis) — loaded lazily and only on pointer-fine devices.
 *
 * The library is dynamically imported so it never lands in the main bundle:
 * mobile visitors (93% of our SERP impressions are desktop, so mobile is the
 * weak spot) download zero bytes for it, which keeps TBT/LCP low.
 */
export default function useSmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (coarse || reduced || "ontouchstart" in window) return;

    let disposed = false;
    let rafId = 0;

    const start = async () => {
      const { default: Lenis } = await import("lenis");
      if (disposed) return;

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenisInstance = lenis;

      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    };

    // Wait for the browser to go idle so the main thread stays free during
    // first paint / hydration.
    const w = window as any;
    const idle = (cb: () => void) =>
      typeof w.requestIdleCallback === "function"
        ? w.requestIdleCallback(cb, { timeout: 2000 })
        : w.setTimeout(cb, 1200);
    const handle = idle(() => void start());

    return () => {
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (typeof w.cancelIdleCallback === "function") w.cancelIdleCallback(handle);
      else clearTimeout(handle);
      lenisInstance?.destroy();
      lenisInstance = null;
    };
  }, []);
}

export function getLenis() {
  return lenisInstance;
}
