"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { BackgroundGrid } from "./BackgroundGrid";
import { StrictCard } from "./StrictCard";
import { stepsData } from "@/app/data/landingData";
import { sectionTitleAnimation, getTextFadeIn, pulseAnimation } from "@/app/utils/landing/animations";

export function StepsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const stepRefs = stepsData.map(() => useRef<HTMLDivElement>(null));
  const numberRefs = stepsData.map(() => useRef<HTMLDivElement>(null));
  const cardRefs = stepsData.map(() => useRef<HTMLDivElement>(null));

  return (
    <section ref={sectionRef} className="py-12 md:py-20 px-0 sm:px-4 md:px-6 lg:px-8 bg-[#080808] relative overflow-hidden" id="steps">
      <BackgroundGrid className="z-0" size={40} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-16 text-white text-center"
          {...sectionTitleAnimation}
        >
          Как создать одностраничный сайт
        </motion.h2>

        <div className="relative">
          {stepsData.map((item, index) => {
            const { scrollYProgress: blockScrollProgress } = useScroll({
              target: stepRefs[index],
              offset: ["start 0.6", "start 0.4"],
            });

            const stepProgress = useTransform(
              blockScrollProgress,
              [0, 1],
              [0, 1],
              { clamp: true }
            );

            const numberOpacity = useTransform(stepProgress, [0, 0.2, 0.8, 1], [0.1, 0.25, 0.2, 0.15]);
            const numberScale = useTransform(stepProgress, [0, 0.3, 0.7, 1], [0.95, 1, 1, 1]);
            const cardOpacity = useTransform(stepProgress, [0, 0.4, 1], [0, 1, 1]);
            const lineProgress = useTransform(stepProgress, [0, 0.1, 0.5, 1], [0, 0, 1, 1]);

            return (
              <div
                key={index}
                ref={stepRefs[index]}
                className="relative mb-16 md:mb-32 last:mb-0 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center"
                style={{ minHeight: "200px" }}
              >
                <div className="relative flex items-center justify-start pl-0 md:pl-4 lg:pl-8">
                  <motion.div
                    ref={numberRefs[index]}
                    className="relative"
                    style={{
                      opacity: numberOpacity,
                      scale: numberScale,
                    }}
                  >
                    <span className="text-6xl sm:text-7xl md:text-9xl lg:text-[12rem] font-bold text-white/45 select-none tracking-tighter block">
                      {item.step}
                    </span>
                  </motion.div>
                </div>

                <motion.div
                  ref={cardRefs[index]}
                  className="relative"
                  style={{
                    opacity: cardOpacity,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      ease: "easeOut",
                    }}
                  >
                    <StrictCard className="hover:border-white/20 transition-colors duration-300 relative z-10">
                      <motion.h3
                        className="text-xl md:text-2xl font-bold mb-3 text-white"
                        {...getTextFadeIn(index * 0.1 + 0.1)}
                      >
                        {item.title}
                      </motion.h3>
                      <motion.p
                        className="text-white/70 leading-relaxed"
                        {...getTextFadeIn(index * 0.1 + 0.15)}
                      >
                        {item.description}
                      </motion.p>
                    </StrictCard>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="absolute top-1/2 h-0.5 bg-white/20 origin-left -translate-y-1/2 hidden md:block"
                  style={{
                    left: "calc(28% - 4rem)",
                    width: "calc(19rem + 2rem)",
                    scaleX: lineProgress,
                  }}
                />

                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-30 hidden md:block"
                  style={{
                    left: useTransform(
                      lineProgress,
                      (p: number) => `calc(28% - 4rem + ${p * 21}rem - 4px)`
                    ),
                    opacity: useTransform(lineProgress, (p: number) => (p > 0 && p < 1 ? 1 : 0)),
                  }}
                >
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    {...pulseAnimation}
                  />
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
