import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if ("ontouchstart" in window || window.matchMedia("(pointer: coarse)").matches) return;

    const pos = { x: 0, y: 0 };
    const smoothPos = { x: 0, y: 0 };

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) setVisible(true);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
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
      smoothPos.x += (pos.x - smoothPos.x) * 0.15;
      smoothPos.y += (pos.y - smoothPos.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${smoothPos.x}px, ${smoothPos.y}px)`;
      }
      animId = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    animId = requestAnimationFrame(animate);

    // Hide default cursor globally
    document.documentElement.style.cursor = "none";
    const style = document.createElement("style");
    style.textContent = "a,button,input,textarea,select,[role='button']{cursor:none!important}";
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

  // Don't render on touch
  if (typeof window !== "undefined" && ("ontouchstart" in window || window.matchMedia("(pointer: coarse)").matches)) {
    return null;
  }

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-[width,height,opacity] duration-150"
        style={{
          width: hovering ? 8 : 6,
          height: hovering ? 8 : 6,
          borderRadius: "50%",
          backgroundColor: "white",
          opacity: visible ? 1 : 0,
        }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-[width,height,border-color,opacity] duration-300"
        style={{
          width: hovering ? 48 : 32,
          height: hovering ? 48 : 32,
          borderRadius: "50%",
          border: `1.5px solid ${hovering ? "hsl(252, 60%, 63%)" : "rgba(255,255,255,0.5)"}`,
          opacity: visible ? 0.7 : 0,
        }}
      />
    </>
  );
}
