import { Easing } from "framer-motion";

export const sectionTitleAnimation = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" as Easing },
};

export const getCardAnimation = (index: number, delayMultiplier: number = 0.1) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: {
    duration: 0.5,
    delay: index * delayMultiplier,
    ease: "easeOut" as Easing,
  },
  whileHover: {
    y: -4,
    transition: { duration: 0.2 },
  },
});

export const getCardAnimationSmall = (index: number, delayMultiplier: number = 0.05) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: {
    duration: 0.5,
    delay: index * delayMultiplier,
    ease: "easeOut" as Easing,
  },
  whileHover: {
    y: -3,
    transition: { duration: 0.2 },
  },
});

export const buttonHoverAnimation = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
};

export const getFadeInAnimation = (delay: number = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.6,
    delay,
    ease: "easeOut" as Easing,
  },
});

export const getFadeInAnimationSmall = (delay: number = 0) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.5,
    delay,
    ease: "easeOut" as Easing,
  },
});

export const getTextFadeIn = (delay: number = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

export const pulseAnimation = {
  animate: {
    opacity: [0.5, 0.8, 0.5],
  },
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut" as Easing,
  },
};

