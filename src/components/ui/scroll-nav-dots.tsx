import { useEffect, useState } from "react";

/**
 * Sticky Linear-style scroll-nav dots for the homepage.
 * Desktop only (lg+), fades in after the hero. Pure CSS + a single
 * IntersectionObserver — zero dependency cost.
 *
 * Each section to track should expose `data-scroll-section="{id}"` and
 * a matching `data-scroll-label` attribute on the same element.
 */

type Section = { id: string; label: string };

interface Props {
  sections: Section[];
}

export default function ScrollNavDots({ sections }: Props) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = sections
      .map((s) => document.querySelector<HTMLElement>(`[data-scroll-section="${s.id}"]`))
      .filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visibleEntry) {
          const id = visibleEntry.target.getAttribute("data-scroll-section");
          if (id) setActive(id);
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.querySelector<HTMLElement>(`[data-scroll-section="${id}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Section navigation"
      className={`hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {sections.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollTo(s.id)}
            aria-label={`Jump to ${s.label}`}
            aria-current={isActive ? "true" : undefined}
            className="group relative flex items-center justify-end gap-2 focus-visible:outline-none"
          >
            <span
              className={`pointer-events-none text-[11px] font-mono uppercase tracking-wider text-foreground/80 bg-background/70 backdrop-blur-md px-2 py-1 rounded-md border border-white/[0.06] transition-all duration-300 ${
                isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
              }`}
            >
              {s.label}
            </span>
            <span
              className={`block rounded-full border transition-all duration-300 ${
                isActive
                  ? "w-2.5 h-2.5 bg-primary border-primary shadow-[0_0_12px_hsl(256_90%_62%/0.8)]"
                  : "w-2 h-2 bg-transparent border-white/30 group-hover:border-primary/70"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
