"use client";

import { motion } from "framer-motion";

interface CometProps {
  delay?: number;
  duration?: number;
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
}

export function Comet({
  delay = 0,
  duration = 8,
  startX = -100,
  startY = 0,
  endX = 120,
  endY = 100,
}: CometProps) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      initial={{ x: `${startX}vw`, y: `${startY}vh`, opacity: 0 }}
      animate={{
        x: `${endX}vw`,
        y: `${endY}vh`,
        opacity: [0, 0.3, 0.3, 0],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatDelay: 20,
        ease: "linear",
      }}
    >
      <div className="relative">
        <div className="w-1.5 h-1.5 bg-white rounded-full blur-sm" />
        <div className="absolute top-0.5 left-0.5 w-32 h-0.5 bg-white/30 blur-sm" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.3), transparent)' }} />
      </div>
    </motion.div>
  );
}

