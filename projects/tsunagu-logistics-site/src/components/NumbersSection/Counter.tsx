"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function Counter({ value, duration = 1.4 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const startedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const start = () => {
    if (startedRef.current) return;
    startedRef.current = true;

    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / (duration * 1000));
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <motion.span
      onViewportEnter={start}
      viewport={{ once: true, amount: 0.6 }}
    >
      {display.toLocaleString("ja-JP")}
    </motion.span>
  );
}
