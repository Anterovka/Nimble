// Общие конфигурации анимаций для оптимизации кода
import { Easing } from "framer-motion";

// Анимация появления заголовка секции
export const sectionTitleAnimation = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" as Easing },
};

// Анимация появления элемента при скролле
export const fadeInUpAnimation = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" as Easing },
};

// Анимация карточки с задержкой по индексу
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

// Анимация карточки с меньшим подъемом при hover
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

// Анимация кнопки с масштабированием
export const buttonHoverAnimation = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
};

// Анимация появления с задержкой (для hero секции)
export const getFadeInAnimation = (delay: number = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.6,
    delay,
    ease: "easeOut" as Easing,
  },
});

// Анимация появления с меньшим смещением
export const getFadeInAnimationSmall = (delay: number = 0) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.5,
    delay,
    ease: "easeOut" as Easing,
  },
});

// Анимация появления текста
export const getTextFadeIn = (delay: number = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

// Анимация пульсации (для точек/индикаторов)
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

