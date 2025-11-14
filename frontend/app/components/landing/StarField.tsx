"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface StarFieldProps {
  className?: string;
  starCount?: number;
}

export function StarField({ className = "", starCount = 80 }: StarFieldProps) {
  const [stars, setStars] = useState<Array<{
    id: number;
    x: number;
    startY: number;
    size: number;
    delay: number;
    duration: number;
    speed: number;
  }>>([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: starCount }, (_, i) => {
      const isOnScreen = Math.random() < 0.6;
      const startY = isOnScreen ? Math.random() * 110 - 10 : 110;
      
      return {
        id: i,
        x: Math.random() * 100,
        startY: startY,
        size: Math.random() * 2.5 + 1.5,
        delay: Math.random() * 3,
        duration: Math.random() * 3 + 2,
        speed: Math.random() * 0.7 + 0.5,
      };
    });
    setStars(generatedStars);
  }, [starCount]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          initial={{
            top: `${star.startY}%`,
            opacity: 0.4,
          }}
          animate={{
            opacity: [0.4, 0.8, 0.6, 0.8, 0.4],
            top: [`${star.startY}%`, "-10%"],
          }}
          transition={{
            opacity: {
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: "easeInOut",
            },
            top: {
              duration: 20 / star.speed,
              delay: star.delay,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        />
      ))}
    </div>
  );
}

