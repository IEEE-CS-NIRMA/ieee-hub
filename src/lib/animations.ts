import { Variants } from "framer-motion";

// ─── Easing curves ────────────────────────────────────────────────────────────
export const ease = {
  out: [0.16, 1, 0.3, 1],
  in: [0.7, 0, 0.84, 0],
  inOut: [0.87, 0, 0.13, 1],
  spring: { type: "spring", stiffness: 70, damping: 18 },
  springFast: { type: "spring", stiffness: 120, damping: 20 },
} as const;

// ─── Fade + rise ─────────────────────────────────────────────────────────────
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.7, ease: ease.out },
  }),
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { delay: i * 0.08, duration: 0.6, ease: ease.out },
  }),
};

// ─── Slide from sides ─────────────────────────────────────────────────────────
export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, duration: 0.7, ease: ease.out },
  }),
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, duration: 0.7, ease: ease.out },
  }),
};

// ─── Scale + fade ────────────────────────────────────────────────────────────
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.07, duration: 0.6, ease: ease.out },
  }),
};

// ─── Clip-path reveal (bottom-up curtain) ─────────────────────────────────────
export const clipReveal: Variants = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 },
  visible: (i: number = 0) => ({
    clipPath: "inset(0% 0% 0% 0%)",
    opacity: 1,
    transition: { delay: i * 0.1, duration: 0.8, ease: ease.out },
  }),
};

// ─── Stagger container ───────────────────────────────────────────────────────
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const staggerContainerFast: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

// ─── Word reveal (used with AnimatedText) ────────────────────────────────────
export const wordContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export const wordItem: Variants = {
  hidden: { opacity: 0, y: 30, rotateX: 40 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.55, ease: ease.out },
  },
};

// ─── Line reveal (horizontal) ────────────────────────────────────────────────
export const lineReveal: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: (i: number = 0) => ({
    scaleX: 1,
    transition: { delay: i * 0.1, duration: 0.8, ease: ease.out },
  }),
};

// ─── Counter (used for stats) ────────────────────────────────────────────────
export const counterVariant: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, ...ease.spring },
  }),
};

// ─── Badge pop ───────────────────────────────────────────────────────────────
export const badgePop: Variants = {
  hidden: { opacity: 0, scale: 0.6, y: 10 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: i * 0.06, ...ease.springFast },
  }),
};

// ─── Card hover spring config ─────────────────────────────────────────────────
export const cardHover = {
  rest: { y: 0, boxShadow: "var(--shadow-brutal)" },
  hover: {
    y: -6,
    boxShadow: "var(--shadow-brutal-hover)",
    transition: ease.spring,
  },
};
