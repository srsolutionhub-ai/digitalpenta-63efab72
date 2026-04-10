import { useEffect } from "react";
import Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export default function useSmoothScroll() {
  useEffect(() => {
    // Disable on touch devices
    if ("ontouchstart" in window) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisInstance = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}

export function getLenis() {
  return lenisInstance;
}
