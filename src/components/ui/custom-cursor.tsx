import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });
  const smoothRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if ("ontouchstart" in window || window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
      if (!visible) setVisible(true);
      // Dot follows instantly via transform — no React re-render
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [role='button'], input, textarea, select, [data-cursor='pointer']");
      setHovering(!!interactive);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    let animId: number;
    const animate = () => {
      const pos = posRef.current;
      const smooth = smoothRef.current;
      smooth.x += (pos.x - smooth.x) * 0.12;
      smooth.y += (pos.y - smooth.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${smooth.x}px`;
        ringRef.current.style.top = `${smooth.y}px`;
      }
      animId = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    animId = requestAnimationFrame(animate);

    document.documentElement.style.cursor = "none";
    const style = document.createElement("style");
    style.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(style);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(animId);
      document.documentElement.style.cursor = "";
      style.remove();
    };
  }, [visible]);

  if (typeof window !== "undefined" && ("ontouchstart" in window || window.matchMedia("(pointer: coarse)").matches)) {
    return null;
  }

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed z-[9999]"
        style={{
          width: hovering ? 10 : 6,
          height: hovering ? 10 : 6,
          borderRadius: "50%",
          backgroundColor: "white",
          opacity: visible ? 1 : 0,
          transform: "translate(-50%, -50%)",
          transition: "width 0.15s, height 0.15s, opacity 0.15s",
          willChange: "left, top",
          mixBlendMode: "difference",
        }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed z-[9998]"
        style={{
          width: hovering ? 48 : 32,
          height: hovering ? 48 : 32,
          borderRadius: "50%",
          border: `1.5px solid ${hovering ? "hsl(252, 60%, 63%)" : "rgba(255,255,255,0.4)"}`,
          opacity: visible ? 0.6 : 0,
          transform: "translate(-50%, -50%)",
          transition: "width 0.25s ease-out, height 0.25s ease-out, border-color 0.25s, opacity 0.2s",
          willChange: "left, top",
          mixBlendMode: "difference",
        }}
      />
    </>
  );
}
