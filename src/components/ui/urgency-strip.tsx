import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const messages = [
  "🔴 Live: Priya from Mumbai just booked a strategy call",
  "🟢 23 businesses requested proposals this week",
  "⭐ 4.9/5 rating from 87 verified reviews",
];

export default function UrgencyStrip() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex((i) => (i + 1) % messages.length), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border-y border-border/50 py-3 overflow-hidden">
      <div className="container mx-auto px-4 flex justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={messages[index]}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm text-muted-foreground font-medium"
          >
            {messages[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
