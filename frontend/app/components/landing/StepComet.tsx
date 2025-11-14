"use client";

import { motion, useTransform } from "framer-motion";

interface StepCometProps {
  progress: any;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  lineLength: number;
}

export function StepComet({
  progress,
  startX,
  startY,
  endX,
  endY,
  lineLength,
}: StepCometProps) {
  const x = useTransform(progress, (p: number) => startX + (endX - startX) * p);
  const y = useTransform(progress, (p: number) => startY + (endY - startY) * p);
  const opacity = useTransform(progress, (p: number) => (p > 0 && p < 1 ? 1 : 0));

  return (
    <motion.div
      className="absolute pointer-events-none z-30"
      style={{
        left: x,
        top: y,
        opacity: opacity,
        transform: "translate(-50%, -50%)",
      }}
    >
      <motion.div
        className="w-2 h-2 bg-white rounded-full"
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 h-0.5 bg-white/60"
        style={{
          width: `${lineLength * 0.3}px`,
          transform: `translate(-50%, -50%) rotate(${Math.atan2(endY - startY, endX - startX) * (180 / Math.PI)}deg)`,
          transformOrigin: "left center",
          filter: "blur(3px)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}

