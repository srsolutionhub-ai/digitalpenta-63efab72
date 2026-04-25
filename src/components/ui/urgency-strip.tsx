import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const messages = [
  { icon: "🔴", text: "Live: Priya from Mumbai just booked a strategy call", color: "hsl(0 90% 65%)" },
  { icon: "🟢", text: "23 businesses requested proposals this week", color: "hsl(162 100% 50%)" },
  { icon: "⭐", text: "4.9/5 rating from 87 verified reviews", color: "hsl(48 100% 65%)" },
];

export default function UrgencyStrip() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex((i) => (i + 1) % messages.length), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative overflow-hidden py-3 border-y border-white/[0.06]"
      style={{
        background:
          "linear-gradient(90deg, hsl(240 30% 7%) 0%, hsl(256 40% 10%) 50%, hsl(240 30% 7%) 100%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 50%, hsl(256 90% 62% / 0.18), transparent 70%)",
        }}
      />
      <div className="container mx-auto px-4 flex justify-center relative z-10">
        <AnimatePresence mode="wait">
          <motion.span
            key={messages[index].text}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm font-display font-medium flex items-center gap-2"
          >
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{
                background: messages[index].color,
                boxShadow: `0 0 12px ${messages[index].color}`,
                animation: "chip-pulse 1.6s ease-in-out infinite",
              }}
            />
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, hsl(220 20% 92%), hsl(192 100% 80%) 50%, hsl(220 20% 92%))" }}
            >
              {messages[index].text}
            </span>
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
